import path from "path";
import ts, { factory, sys } from "typescript";

const ROOT = process.cwd();
const ROOT_FOLDER_NAME = "locales";
const OUTPUT_PATH = path.join(ROOT, "i18n.ts");

const generateI18nTypes = () => {
  const LOCALE_DIR = sys.getDirectories(path.join(ROOT, ROOT_FOLDER_NAME));

  const localesArrayAsConst = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(ROOT_FOLDER_NAME),
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createArrayLiteralExpression(
              LOCALE_DIR.map((locale) => factory.createStringLiteral(locale)),
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

  const sourceFiles = sys.readDirectory(
    path.join(ROOT, ROOT_FOLDER_NAME, LOCALE_DIR[0])
  );

  const parsedSourceFiles = sourceFiles.map((file) => {
    const { name } = path.parse(file);

    const localeImportDeclaration = factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(name),
        undefined
      ),
      factory.createStringLiteral(
        `${ROOT_FOLDER_NAME}/${LOCALE_DIR[0]}/${name}.json`
      )
    );

    return { name, localeImportDeclaration };
  });

  const i18nMap = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier("I18nMap"),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier("Record"), [
      factory.createIndexedAccessTypeNode(
        factory.createTypeQueryNode(factory.createIdentifier(ROOT_FOLDER_NAME)),
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
      ...parsedSourceFiles.map((file) => file.localeImportDeclaration),
      localesArrayAsConst,
      i18nMap,
    ]),
    factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  const result = printer.printFile(sourceFile);

  sys.writeFile(OUTPUT_PATH, result);
};

const main = () => {
  if (!sys.watchDirectory) {
    throw Error(
      "sys.watchDirectory is not available to the TypeScript compiler"
    );
  }

  console.log(
    `Starting i18n type generation in watch mode, writing to ${OUTPUT_PATH}`
  );

  generateI18nTypes();

  sys.watchDirectory(
    path.join(ROOT, ROOT_FOLDER_NAME),
    generateI18nTypes,
    true
  );
};

export default main;
