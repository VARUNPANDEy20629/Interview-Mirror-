"""Lightweight Java symbol extraction without external dependencies."""
import re


def parse_java(source: str, path: str) -> dict:
    lines = source.splitlines()
    classes = []
    methods = []
    for index, line in enumerate(lines, 1):
        class_match = re.search(r"\b(?:class|interface|enum)\s+([A-Za-z_$][\w$]*)", line)
        if class_match:
            classes.append({"name": class_match.group(1), "start_line": index, "end_line": index})
        method_match = re.search(
            r"\b(?:public|protected|private|static|\s)+([\w<>\[\], ?]+)\s+([A-Za-z_$][\w$]*)\s*\([^;]*\)\s*\{?",
            line,
        )
        if method_match and not class_match:
            methods.append({
                "name": method_match.group(2),
                "start_line": index,
                "end_line": index,
                "return_type": method_match.group(1).strip(),
            })
    return {"language": "Java", "file": path, "functions": methods, "classes": classes, "imports": []}
