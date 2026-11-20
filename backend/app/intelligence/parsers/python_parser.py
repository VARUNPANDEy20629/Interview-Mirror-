"""Extract functions, classes, imports and calls from Python source using the built-in ast module."""
import ast


def parse_python(source: str, path: str) -> dict:
    try:
        tree = ast.parse(source)
    except (SyntaxError, ValueError):
        return {"language": "Python", "file": path, "functions": [], "classes": [], "imports": [],
                "parse_error": "Invalid Python syntax"}
    functions, classes, imports = [], [], []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            functions.append({"name": node.name, "start_line": node.lineno, "end_line": node.end_lineno,
                              "params": [a.arg for a in node.args.args]})
        elif isinstance(node, ast.ClassDef):
            classes.append({"name": node.name, "start_line": node.lineno, "end_line": node.end_lineno,
                            "bases": [ast.unparse(b) for b in node.bases]})
        elif isinstance(node, ast.Import):
            imports += [a.name for a in node.names]
        elif isinstance(node, ast.ImportFrom):
            imports.append(node.module or "")
    return {"language": "Python", "file": path, "functions": functions, "classes": classes, "imports": imports}
