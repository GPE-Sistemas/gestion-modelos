import * as fs from "fs";
import * as path from "path";

interface ProtoFile {
  name: string;
  fileName: string;
  messages: string[];
  enums: string[];
  imports: string[];
}

class ProtoIndexGenerator {
  private protoDir: string;

  constructor(protoDir: string) {
    this.protoDir = protoDir;
  }

  async generateIndex(): Promise<void> {
    console.log("📚 Generando índice de archivos Protocol Buffers...");

    const protoFiles = await this.analyzeProtoFiles();
    const indexContent = this.generateIndexContent(protoFiles);

    const indexPath = path.join(this.protoDir, "INDEX.md");
    fs.writeFileSync(indexPath, indexContent);

    console.log(`✅ Índice generado: ${indexPath}`);
  }

  private async analyzeProtoFiles(): Promise<ProtoFile[]> {
    const files = fs
      .readdirSync(this.protoDir)
      .filter((file) => file.endsWith(".proto"))
      .sort();

    const protoFiles: ProtoFile[] = [];

    for (const file of files) {
      const filePath = path.join(this.protoDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      const messages = this.extractMessageNames(content);
      const enums = this.extractEnumNames(content);
      const imports = this.extractImports(content);

      protoFiles.push({
        name: file.replace(".proto", ""),
        fileName: file,
        messages,
        enums,
        imports,
      });
    }

    return protoFiles;
  }

  private extractMessageNames(content: string): string[] {
    const messageRegex = /^message\s+(\w+)/gm;
    const messages: string[] = [];
    let match;

    while ((match = messageRegex.exec(content)) !== null) {
      messages.push(match[1]);
    }

    return messages;
  }

  private extractEnumNames(content: string): string[] {
    const enumRegex = /^enum\s+(\w+)/gm;
    const enums: string[] = [];
    let match;

    while ((match = enumRegex.exec(content)) !== null) {
      enums.push(match[1]);
    }

    return enums;
  }

  private extractImports(content: string): string[] {
    const importRegex = /import\s+"([^"]+)";/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  private generateIndexContent(protoFiles: ProtoFile[]): string {
    let content = `# Índice de Archivos Protocol Buffers\n\n`;
    content += `*Generado automáticamente - ${new Date().toISOString()}*\n\n`;

    // Stats summary
    const totalMessages = protoFiles.reduce(
      (sum, file) => sum + file.messages.length,
      0
    );
    const totalEnums = protoFiles.reduce(
      (sum, file) => sum + file.enums.length,
      0
    );

    content += `## 📊 Resumen\n\n`;
    content += `- **Total de archivos**: ${protoFiles.length}\n`;
    content += `- **Total de mensajes**: ${totalMessages}\n`;
    content += `- **Total de enums**: ${totalEnums}\n\n`;

    // Table of contents
    content += `## 📋 Tabla de Contenidos\n\n`;

    // Group by type
    const messageFiles = protoFiles.filter(
      (f) => f.messages.length > 0 && f.enums.length === 0
    );
    const enumFiles = protoFiles.filter(
      (f) => f.enums.length > 0 && f.messages.length === 0
    );
    const mixedFiles = protoFiles.filter(
      (f) => f.messages.length > 0 && f.enums.length > 0
    );

    if (messageFiles.length > 0) {
      content += `### 📝 Archivos de Mensajes\n\n`;
      for (const file of messageFiles) {
        content += `- [\`${file.fileName}\`](#${file.name
          .toLowerCase()
          .replace(/-/g, "")})\n`;
      }
      content += "\n";
    }

    if (enumFiles.length > 0) {
      content += `### 🏷️ Archivos de Enums\n\n`;
      for (const file of enumFiles) {
        content += `- [\`${file.fileName}\`](#${file.name
          .toLowerCase()
          .replace(/-/g, "")})\n`;
      }
      content += "\n";
    }

    if (mixedFiles.length > 0) {
      content += `### 🔀 Archivos Mixtos\n\n`;
      for (const file of mixedFiles) {
        content += `- [\`${file.fileName}\`](#${file.name
          .toLowerCase()
          .replace(/-/g, "")})\n`;
      }
      content += "\n";
    }

    // Detailed listings
    content += `## 📖 Detalles de Archivos\n\n`;

    for (const file of protoFiles) {
      content += `### ${file.name}\n\n`;
      content += `**Archivo**: \`${file.fileName}\`\n\n`;

      if (file.messages.length > 0) {
        content += `**Mensajes**:\n`;
        for (const message of file.messages) {
          content += `- \`${message}\`\n`;
        }
        content += "\n";
      }

      if (file.enums.length > 0) {
        content += `**Enums**:\n`;
        for (const enumName of file.enums) {
          content += `- \`${enumName}\`\n`;
        }
        content += "\n";
      }

      if (file.imports.length > 0) {
        content += `**Dependencias**:\n`;
        for (const importName of file.imports) {
          const linkedImport = importName.replace(".proto", "");
          content += `- [\`${importName}\`](#${linkedImport
            .toLowerCase()
            .replace(/-/g, "")})\n`;
        }
        content += "\n";
      }

      content += "---\n\n";
    }

    // Search index
    content += `## 🔍 Índice de Búsqueda\n\n`;
    content += `### Mensajes por orden alfabético\n\n`;

    const allMessages = protoFiles
      .flatMap((f) => f.messages.map((m) => ({ message: m, file: f.fileName })))
      .sort((a, b) => a.message.localeCompare(b.message));

    for (const { message, file } of allMessages) {
      const anchor = file.replace(".proto", "").toLowerCase().replace(/-/g, "");
      content += `- \`${message}\` → [\`${file}\`](#${anchor})\n`;
    }

    content += `\n### Enums por orden alfabético\n\n`;

    const allEnums = protoFiles
      .flatMap((f) => f.enums.map((e) => ({ enum: e, file: f.fileName })))
      .sort((a, b) => a.enum.localeCompare(b.enum));

    for (const { enum: enumName, file } of allEnums) {
      const anchor = file.replace(".proto", "").toLowerCase().replace(/-/g, "");
      content += `- \`${enumName}\` → [\`${file}\`](#${anchor})\n`;
    }

    return content;
  }
}

// Ejecutar el generador
async function main() {
  const generator = new ProtoIndexGenerator(path.join(process.cwd(), "proto"));

  try {
    await generator.generateIndex();
  } catch (error) {
    console.error("❌ Error generando el índice:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
