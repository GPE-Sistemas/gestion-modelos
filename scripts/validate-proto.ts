import * as fs from "fs";
import * as path from "path";

interface ProtoStats {
  totalFiles: number;
  totalMessages: number;
  totalEnums: number;
  totalFields: number;
  filesByType: {
    messages: number;
    enums: number;
    mixed: number;
  };
}

class ProtoValidator {
  private protoDir: string;

  constructor(protoDir: string) {
    this.protoDir = protoDir;
  }

  async validateAndReport(): Promise<void> {
    console.log("🔍 Validando archivos Protocol Buffers...\n");

    const stats = await this.analyzeProtoFiles();
    this.printStats(stats);

    const issues = await this.validateSyntax();
    if (issues.length > 0) {
      console.log("\n⚠️  Problemas encontrados:");
      issues.forEach((issue) => console.log(`  - ${issue}`));
    } else {
      console.log("\n✅ Todos los archivos .proto son válidos!");
    }
  }

  private async analyzeProtoFiles(): Promise<ProtoStats> {
    const stats: ProtoStats = {
      totalFiles: 0,
      totalMessages: 0,
      totalEnums: 0,
      totalFields: 0,
      filesByType: {
        messages: 0,
        enums: 0,
        mixed: 0,
      },
    };

    const files = fs
      .readdirSync(this.protoDir)
      .filter((file) => file.endsWith(".proto"));

    stats.totalFiles = files.length;

    for (const file of files) {
      const filePath = path.join(this.protoDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const messages = (content.match(/^message\s+\w+/gm) || []).length;
      const enums = (content.match(/^enum\s+\w+/gm) || []).length;
      const fields = (content.match(/^\s+\w+\s+\w+\s+=\s+\d+;/gm) || []).length;

      stats.totalMessages += messages;
      stats.totalEnums += enums;
      stats.totalFields += fields;

      // Clasificar archivos
      if (messages > 0 && enums === 0) {
        stats.filesByType.messages++;
      } else if (enums > 0 && messages === 0) {
        stats.filesByType.enums++;
      } else if (messages > 0 && enums > 0) {
        stats.filesByType.mixed++;
      }
    }

    return stats;
  }

  private async validateSyntax(): Promise<string[]> {
    const issues: string[] = [];
    const files = fs
      .readdirSync(this.protoDir)
      .filter((file) => file.endsWith(".proto"));

    for (const file of files) {
      const filePath = path.join(this.protoDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // Validaciones básicas
      if (!content.includes('syntax = "proto3";')) {
        issues.push(`${file}: Falta declaración de sintaxis proto3`);
      }

      if (!content.includes("package gestion.modelos;")) {
        issues.push(`${file}: Falta declaración de package`);
      }

      // Verificar imports válidos
      const importMatches = content.match(/import\s+"([^"]+)";/g);
      if (importMatches) {
        for (const importMatch of importMatches) {
          const importFile = importMatch.match(/import\s+"([^"]+)";/)?.[1];
          if (
            importFile &&
            !fs.existsSync(path.join(this.protoDir, importFile))
          ) {
            issues.push(`${file}: Import no encontrado: ${importFile}`);
          }
        }
      }

      // Verificar que los campos tengan números únicos por mensaje/enum
      const messages = this.extractMessages(content);
      for (const message of messages) {
        const fieldNumbers = this.extractFieldNumbers(message.content);
        const duplicates = this.findDuplicates(fieldNumbers);
        if (duplicates.length > 0) {
          issues.push(
            `${file}: Números de campo duplicados en ${
              message.name
            }: ${duplicates.join(", ")}`
          );
        }
      }

      const enums = this.extractEnums(content);
      for (const enumDef of enums) {
        const fieldNumbers = this.extractFieldNumbers(enumDef.content);
        const duplicates = this.findDuplicates(fieldNumbers);
        if (duplicates.length > 0) {
          issues.push(
            `${file}: Números de campo duplicados en enum ${
              enumDef.name
            }: ${duplicates.join(", ")}`
          );
        }
      }
    }

    return issues;
  }

  private extractFieldNumbers(content: string): number[] {
    const fieldRegex = /=\s+(\d+);/g;
    const numbers: number[] = [];
    let match;

    while ((match = fieldRegex.exec(content)) !== null) {
      numbers.push(parseInt(match[1]));
    }

    return numbers;
  }

  private extractMessages(
    content: string
  ): Array<{ name: string; content: string }> {
    const messages: Array<{ name: string; content: string }> = [];
    const messageRegex = /message\s+(\w+)\s*{([^}]*)}/g;
    let match;

    while ((match = messageRegex.exec(content)) !== null) {
      messages.push({
        name: match[1],
        content: match[2],
      });
    }

    return messages;
  }

  private extractEnums(
    content: string
  ): Array<{ name: string; content: string }> {
    const enums: Array<{ name: string; content: string }> = [];
    const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
    let match;

    while ((match = enumRegex.exec(content)) !== null) {
      enums.push({
        name: match[1],
        content: match[2],
      });
    }

    return enums;
  }

  private findDuplicates(numbers: number[]): number[] {
    const seen = new Set<number>();
    const duplicates = new Set<number>();

    for (const num of numbers) {
      if (seen.has(num)) {
        duplicates.add(num);
      } else {
        seen.add(num);
      }
    }

    return Array.from(duplicates);
  }

  private printStats(stats: ProtoStats): void {
    console.log("📊 Estadísticas de archivos Protocol Buffers:");
    console.log(`  📁 Total de archivos: ${stats.totalFiles}`);
    console.log(`  📋 Total de mensajes: ${stats.totalMessages}`);
    console.log(`  🏷️  Total de enums: ${stats.totalEnums}`);
    console.log(`  🔢 Total de campos: ${stats.totalFields}`);
    console.log("\n📂 Distribución por tipo:");
    console.log(`  📝 Solo mensajes: ${stats.filesByType.messages}`);
    console.log(`  🏷️  Solo enums: ${stats.filesByType.enums}`);
    console.log(`  🔀 Mixtos: ${stats.filesByType.mixed}`);

    // Calcular promedio de campos por mensaje
    const avgFields =
      stats.totalMessages > 0
        ? (stats.totalFields / stats.totalMessages).toFixed(1)
        : "0";
    console.log(`\n📈 Promedio de campos por mensaje: ${avgFields}`);
  }
}

// Ejecutar el validador
async function main() {
  const validator = new ProtoValidator(path.join(process.cwd(), "proto"));

  try {
    await validator.validateAndReport();
  } catch (error) {
    console.error("❌ Error durante la validación:", error);
    process.exit(1);
  }
}

export { ProtoValidator };

if (require.main === module) {
  main();
}
