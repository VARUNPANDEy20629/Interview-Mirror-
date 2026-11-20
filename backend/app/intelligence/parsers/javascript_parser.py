"""Lightweight JavaScript symbol extraction without external dependencies."""
import re


def parse_javascript(source: str, path: str) -> dict:
    lines = source.splitlines()
    functions = []
    classes = []
    imports = []
    for index, line in enumerate(lines, 1):
        named = re.search(r"\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)", line)
        arrow = re.search(r"(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>", line)
        class_match = re.search(r"\bclass\s+([A-Za-z_$][\w$]*)", line)
        import_match = re.search(r"(?:import\s+.*?\s+from\s+['\"]([^'\"]+)['\"]|import\s+['\"]([^'\"]+)['\"])", line)
        if named:
            functions.append({"name": named.group(1), "start_line": index, "end_line": index, "params": []})
        elif arrow:
            functions.append({"name": arrow.group(1), "start_line": index, "end_line": index, "params": []})
        if class_match:
            classes.append({"name": class_match.group(1), "start_line": index, "end_line": index, "bases": []})
        if import_match:
            imports.append(import_match.group(1) or import_match.group(2))
    return {"language": "JavaScript", "file": path, "functions": functions, "classes": classes, "imports": imports}
