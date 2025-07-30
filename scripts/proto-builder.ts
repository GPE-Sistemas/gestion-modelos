import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { spawn } from "child_process";

interface FileHash {
  [filePath: string]: string;
}

class ProtoBuilderManager {
  private hashFilePath: string;
  private interfacesDir: string;

  constructor() {
    this.hashFilePath = path.join(process.cwd(), ".proto-hashes.json");
    this.interfacesDir = path.join(process.cwd(), "src", "interfaces");
  }

  async shouldRebuild(): Promise<boolean> {
    console.log(
      "🔍 Verificando si es necesario regenerar archivos Protocol Buffers..."
    );

    // Si no existe el directorio proto, necesitamos construir
    const protoDir = path.join(process.cwd(), "proto");
    if (!fs.existsSync(protoDir)) {
      console.log("📁 Directorio proto no existe, se regenerará todo");
      return true;
    }

    // Si no existe el archivo de hashes, necesitamos construir
    if (!fs.existsSync(this.hashFilePath)) {
      console.log("📋 Archivo de hashes no existe, se regenerará todo");
      return true;
    }

    // Cargar hashes previos
    const previousHashes: FileHash = JSON.parse(
      fs.readFileSync(this.hashFilePath, "utf-8")
    );

    // Calcular hashes actuales
    const currentHashes = await this.calculateCurrentHashes();

    // Comparar hashes
    const hasChanges = this.hasChanges(previousHashes, currentHashes);

    if (hasChanges) {
      console.log("🔄 Se detectaron cambios en las interfaces TypeScript");
      return true;
    } else {
      console.log("✅ No hay cambios, los archivos .proto están actualizados");
      return false;
    }
  }

  async buildIfNeeded(): Promise<void> {
    const shouldBuild = await this.shouldRebuild();

    if (shouldBuild) {
      console.log(
        "🚀 Iniciando regeneración de archivos Protocol Buffers...\n"
      );

      try {
        // Ejecutar el pipeline completo usando npm scripts
        await this.runCommand("npm", ["run", "generate-proto"]);
        await this.runCommand("npm", ["run", "validate-proto"]);
        await this.runCommand("npm", ["run", "generate-index"]);

        // Guardar nuevos hashes
        const currentHashes = await this.calculateCurrentHashes();
        await this.saveHashes(currentHashes);

        console.log(
          "\n✨ Pipeline de Protocol Buffers completado exitosamente!"
        );
      } catch (error) {
        console.error("❌ Error ejecutando el pipeline:", error);
        throw error;
      }
    } else {
      console.log("⏭️  Saltando regeneración - archivos actualizados");
    }
  }

  private runCommand(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  private async calculateCurrentHashes(): Promise<FileHash> {
    const hashes: FileHash = {};

    await this.processDirectory(this.interfacesDir, hashes);

    return hashes;
  }

  private async processDirectory(dir: string, hashes: FileHash): Promise<void> {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        await this.processDirectory(filePath, hashes);
      } else if (file.endsWith(".ts")) {
        const content = fs.readFileSync(filePath, "utf-8");
        const hash = crypto.createHash("md5").update(content).digest("hex");
        const relativePath = path.relative(process.cwd(), filePath);
        hashes[relativePath] = hash;
      }
    }
  }

  private hasChanges(previous: FileHash, current: FileHash): boolean {
    // Verificar si algún archivo cambió
    for (const [filePath, currentHash] of Object.entries(current)) {
      if (previous[filePath] !== currentHash) {
        console.log(`📝 Cambio detectado en: ${filePath}`);
        return true;
      }
    }

    // Verificar si se eliminó algún archivo
    for (const filePath of Object.keys(previous)) {
      if (!(filePath in current)) {
        console.log(`🗑️  Archivo eliminado: ${filePath}`);
        return true;
      }
    }

    // Verificar si se agregó algún archivo nuevo
    for (const filePath of Object.keys(current)) {
      if (!(filePath in previous)) {
        console.log(`➕ Archivo nuevo: ${filePath}`);
        return true;
      }
    }

    return false;
  }

  private async saveHashes(hashes: FileHash): Promise<void> {
    fs.writeFileSync(this.hashFilePath, JSON.stringify(hashes, null, 2));
  }
}

// Función principal para ser llamada desde postinstall
async function main() {
  try {
    const manager = new ProtoBuilderManager();
    await manager.buildIfNeeded();
  } catch (error) {
    console.error("❌ Error en el pipeline de Protocol Buffers:", error);
    // No fallar el proceso de instalación
    console.log("⚠️  Continuando con la instalación...");
  }
}

export { ProtoBuilderManager };

if (require.main === module) {
  main();
}
