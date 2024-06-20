import ast

# Code to analyze
code = """
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
"""

# Parse the code into an AST
tree = ast.parse(code)

# Recursive function to analyze the AST
def analyze_ast(node):
    if isinstance(node, ast.FunctionDef):
        print(f"Function name: {node.name}")
        for arg in node.args.args:
            print(f"Argument: {arg.arg}")
    for child in ast.iter_child_nodes(node):
        analyze_ast(child)

# Analyze the AST
analyze_ast(tree)

# Generate full written AST
ast_dump = ast.dump(tree, annotate_fields=True, include_attributes=True)
print(ast_dump)

# Generate README file
with open('README_AST.md', 'w') as f:
    f.write("# AST Analysis Report\n\n")
    f.write("## Full AST Dump\n")
    f.write(f"```\n{ast_dump}\n```\n")
    f.write("## Mixture of Experts (MOE) Review\n")
    f.write("Details of the MOE review go here.\n")
    f.write("## Debug and Refactor Recommendations\n")
    f.write("Suggestions for debugging and refactoring go here.\n")
    f.write("## Project Update Instructions\n")
    f.write("Instructions for updating the project with the revised AST go here.\n")