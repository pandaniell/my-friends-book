import path from "path";
import ts, { factory, sys } from "typescript";

const ROOT = process.cwd();

const main = () => {
  const locales = sys.getDirectories(path.join(ROOT, "locales"));
  const identifier = "locales";

  const localesVariable = factory.createVariableStatement(
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(identifier),
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createArrayLiteralExpression(
              locales.map((locale) => factory.createStringLiteral(locale)),
              false
            ),
            factory.createTypeReferenceNode(
              factory.createIdentifier("const"),
              undefined
            )
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  );

  const sourceFiles = sys.readDirectory(path.join(ROOT, "locales", locales[0]));

  const parsedSourceFiles = sourceFiles.map((file) => {
    const { name } = path.parse(file);

    const importDeclaration = factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(name),
        undefined
      ),
      factory.createStringLiteral(`locales/en/${name}.json`)
    );

    return { name, importDeclaration };
  });

  const i18nMap = factory.createTypeAliasDeclaration(
    undefined,
    [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier("I18nMap"),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier("Record"), [
      factory.createIndexedAccessTypeNode(
        factory.createTypeQueryNode(factory.createIdentifier(identifier)),
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
      ),
      factory.createTypeLiteralNode(
        parsedSourceFiles.map((file) =>
          factory.createPropertySignature(
            undefined,
            factory.createIdentifier(file.name),
            undefined,
            factory.createTypeQueryNode(factory.createIdentifier(file.name))
          )
        )
      ),
    ])
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const sourceFile = factory.createSourceFile(
    factory.createNodeArray([
      ...parsedSourceFiles.map((file) => file.importDeclaration),
      localesVariable,
      i18nMap,
    ]),
    factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  const result = printer.printFile(sourceFile);

  sys.writeFile(path.join(ROOT, "i18n.ts"), result);

  if (sys.deleteFile) {
    sys.deleteFile(path.join(ROOT, "scripts", "generateI18nTypes.js"));
  }
};

main();
