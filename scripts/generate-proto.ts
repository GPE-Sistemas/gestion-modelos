import * as fs from "fs";
import * as path from "path";

interface ParsedInterface {
  name: string;
  properties: ParsedProperty[];
  imports: string[];
}

interface ParsedProperty {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
}

interface ParsedEnum {
  name: string;
  values: string[];
}

class TypeScriptToProtoConverter {
  private interfaces: Map<string, ParsedInterface> = new Map();
  private enums: Map<string, ParsedEnum> = new Map();
  private processedFiles: Set<string> = new Set();

  constructor(private sourceDir: string, private outputDir: string) {}

  async generateProtoFiles(): Promise<void> {
    console.log("🚀 Iniciando conversión de TypeScript a Protocol Buffers...");

    // Crear directorio de salida si no existe
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Procesar todos los archivos TypeScript en el directorio de interfaces
    await this.processInterfacesDirectory();

    // Generar archivos .proto
    await this.generateProtoFilesFromInterfaces();

    console.log("✅ Conversión completada!");
  }

  private async processInterfacesDirectory(): Promise<void> {
    const interfacesDir = path.join(this.sourceDir, "src", "interfaces");
    const files = fs.readdirSync(interfacesDir);

    for (const file of files) {
      if (file.endsWith(".ts") && file !== "index.ts") {
        const filePath = path.join(interfacesDir, file);
        await this.parseTypeScriptFile(filePath);
      }
    }

    // También procesar subdirectorios
    const chirpstackDir = path.join(interfacesDir, "chirpstack");
    if (fs.existsSync(chirpstackDir)) {
      const chirpstackFiles = fs.readdirSync(chirpstackDir);
      for (const file of chirpstackFiles) {
        if (file.endsWith(".ts") && file !== "index.ts") {
          const filePath = path.join(chirpstackDir, file);
          await this.parseTypeScriptFile(filePath);
        }
      }
    }
  }

  private async parseTypeScriptFile(filePath: string): Promise<void> {
    if (this.processedFiles.has(filePath)) {
      return;
    }
    this.processedFiles.add(filePath);

    console.log(`📖 Procesando: ${path.basename(filePath)}`);

    const content = fs.readFileSync(filePath, "utf-8");

    // Extraer imports
    const imports = this.extractImports(content);

    // Extraer interfaces
    const interfaces = this.extractInterfaces(content, imports);
    interfaces.forEach((iface) => {
      this.interfaces.set(iface.name, iface);
    });

    // Extraer enums y tipos union
    const enums = this.extractEnums(content);
    enums.forEach((enumItem) => {
      this.enums.set(enumItem.name, enumItem);
    });
  }

  private extractImports(content: string): string[] {
    const importRegex = /import\s+{([^}]+)}\s+from\s+["']([^"']+)["']/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importedTypes = match[1].split(",").map((t) => t.trim());
      imports.push(...importedTypes);
    }

    return imports;
  }

  private extractInterfaces(
    content: string,
    imports: string[]
  ): ParsedInterface[] {
    const interfaces: ParsedInterface[] = [];

    // Regex para capturar interfaces
    const interfaceRegex =
      /export\s+interface\s+(\w+)(?:\s+extends\s+[^{]*)??\s*{([^}]*)}/gs;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      const interfaceName = match[1];
      const interfaceBody = match[2];

      const properties = this.parseInterfaceProperties(interfaceBody);

      interfaces.push({
        name: interfaceName,
        properties,
        imports,
      });
    }

    return interfaces;
  }

  private extractEnums(content: string): ParsedEnum[] {
    const enums: ParsedEnum[] = [];

    // Extraer tipos union (type aliases)
    const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
    let match;

    while ((match = typeRegex.exec(content)) !== null) {
      const typeName = match[1];
      const typeDefinition = match[2].trim();

      // Solo procesar si es un tipo union de strings
      if (typeDefinition.includes("|") && typeDefinition.includes('"')) {
        const values = typeDefinition
          .split("|")
          .map((v) => v.trim().replace(/"/g, ""))
          .filter((v) => v && v !== "");

        enums.push({
          name: typeName,
          values,
        });
      }
    }

    return enums;
  }

  private parseInterfaceProperties(interfaceBody: string): ParsedProperty[] {
    const properties: ParsedProperty[] = [];

    // Limpiar comentarios y dividir por líneas
    const cleanBody = interfaceBody
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    const lines = cleanBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of lines) {
      if (line.includes(":")) {
        const property = this.parseProperty(line);
        if (property) {
          properties.push(property);
        }
      }
    }

    return properties;
  }

  private parseProperty(line: string): ParsedProperty | null {
    // Regex para capturar propiedades: nombre, opcional(?), tipo
    const propertyRegex = /^(\w+)(\??):\s*(.+?);?$/;
    const match = propertyRegex.exec(line);

    if (!match) return null;

    const name = match[1];
    const isOptional = match[2] === "?";
    let type = match[3].trim();

    // Detectar arrays
    const isArray = type.endsWith("[]") || type.includes("Array<");
    if (isArray) {
      type = type.replace("[]", "").replace(/Array<(.+)>/, "$1");
    }

    // Limpiar tipos
    type = this.cleanType(type);

    return {
      name,
      type,
      isOptional,
      isArray,
    };
  }

  private cleanType(type: string): string {
    // Remover espacios extra y caracteres no deseados
    type = type.trim().replace(/;$/, "");

    // Mapear tipos complejos
    if (type.includes("|")) {
      // Para tipos union, tomar el primer tipo por simplicidad
      type = type.split("|")[0].trim();
    }

    return type;
  }

  private async generateProtoFilesFromInterfaces(): Promise<void> {
    console.log("🔧 Generando archivos .proto...");

    // Generar un archivo .proto por cada interface
    for (const [interfaceName, interfaceData] of this.interfaces) {
      const protoContent = this.generateProtoForInterface(interfaceData);
      const fileName =
        this.kebabCase(interfaceName.replace(/^I/, "")) + ".proto";
      const filePath = path.join(this.outputDir, fileName);

      fs.writeFileSync(filePath, protoContent);
      console.log(`✏️  Generado: ${fileName}`);
    }

    // Generar archivo con todos los enums
    if (this.enums.size > 0) {
      const enumsProtoContent = this.generateEnumsProto();
      const enumsFilePath = path.join(this.outputDir, "enums.proto");
      fs.writeFileSync(enumsFilePath, enumsProtoContent);
      console.log("✏️  Generado: enums.proto");
    }
  }

  private generateProtoForInterface(interfaceData: ParsedInterface): string {
    const messageName = interfaceData.name.replace(/^I/, "");
    let proto = `syntax = "proto3";\n\n`;
    proto += `package gestion.modelos;\n\n`;

    // Imports necesarios
    const requiredImports = this.getRequiredImports(interfaceData);
    for (const importFile of requiredImports) {
      proto += `import "${importFile}";\n`;
    }
    if (requiredImports.length > 0) {
      proto += "\n";
    }

    // Definición del mensaje
    proto += `message ${messageName} {\n`;

    let fieldNumber = 1;
    for (const property of interfaceData.properties) {
      const protoType = this.typeScriptToProtoType(property.type);
      const fieldName = this.snakeCase(property.name);

      if (property.isArray) {
        proto += `  repeated ${protoType} ${fieldName} = ${fieldNumber};\n`;
      } else if (property.isOptional) {
        proto += `  optional ${protoType} ${fieldName} = ${fieldNumber};\n`;
      } else {
        proto += `  ${protoType} ${fieldName} = ${fieldNumber};\n`;
      }

      fieldNumber++;
    }

    proto += "}\n";
    return proto;
  }

  private generateEnumsProto(): string {
    let proto = `syntax = "proto3";\n\n`;
    proto += `package gestion.modelos;\n\n`;

    for (const [enumName, enumData] of this.enums) {
      proto += `enum ${enumName} {\n`;
      proto += `  ${enumName.toUpperCase()}_UNSPECIFIED = 0;\n`;

      let enumValue = 1;
      for (const value of enumData.values) {
        const enumConstant = this.toEnumConstant(enumName, value);
        proto += `  ${enumConstant} = ${enumValue};\n`;
        enumValue++;
      }

      proto += "}\n\n";
    }

    return proto;
  }

  private getRequiredImports(interfaceData: ParsedInterface): string[] {
    const imports: string[] = [];

    // Verificar si necesita importar enums
    if (this.enums.size > 0) {
      for (const property of interfaceData.properties) {
        if (this.enums.has(property.type)) {
          imports.push("enums.proto");
          break;
        }
      }
    }

    // Verificar si necesita importar otras interfaces
    for (const property of interfaceData.properties) {
      const cleanType = property.type.replace(/^I/, "");
      if (
        this.interfaces.has(property.type) ||
        this.interfaces.has("I" + cleanType)
      ) {
        const fileName = this.kebabCase(cleanType) + ".proto";
        if (!imports.includes(fileName)) {
          imports.push(fileName);
        }
      }
    }

    return imports;
  }

  private typeScriptToProtoType(tsType: string): string {
    // Mapeo básico de tipos
    const typeMap: { [key: string]: string } = {
      string: "string",
      number: "double",
      boolean: "bool",
      Date: "string", // Las fechas se manejan como strings en proto
      any: "string",
      object: "string", // JSON como string
    };

    // Si es un tipo primitivo
    if (typeMap[tsType]) {
      return typeMap[tsType];
    }

    // Si es un enum conocido
    if (this.enums.has(tsType)) {
      return tsType;
    }

    // Si es una interface conocida
    const interfaceName = tsType.startsWith("I") ? tsType.slice(1) : tsType;
    if (
      this.interfaces.has(tsType) ||
      this.interfaces.has("I" + interfaceName)
    ) {
      return interfaceName;
    }

    // Por defecto, usar string
    return "string";
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  private snakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  }

  private toEnumConstant(enumName: string, value: string): string {
    const prefix = enumName.toUpperCase();
    const constant = value.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
    return `${prefix}_${constant}`;
  }
}

// Ejecutar el script
async function main() {
  const converter = new TypeScriptToProtoConverter(
    process.cwd(),
    path.join(process.cwd(), "proto")
  );

  try {
    await converter.generateProtoFiles();
  } catch (error) {
    console.error("❌ Error durante la conversión:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
