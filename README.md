# tree-sitter-parol

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the [Parol](https://github.com/jsinger67/parol) parser generator language.

## Overview

This project provides a complete Tree-sitter grammar for parsing Parol grammar files (`.par` extension). Parol is a powerful LL(k) and LALR(1) parser generator written in Rust that supports advanced features like scanner states, AST generation, and error recovery.

## Features

- **Complete Language Support**: Handles all Parol language constructs including:
  - Grammar productions with alternations and factors
  - Terminal and non-terminal symbols
  - AST control operators (`^` cut operator, `:identifier` member names)
  - Scanner directives (`%scanner`, `%auto_newline_off`, `%auto_ws_off`)
  - Scanner states for lexical modes
  - User type declarations
  - Comments (line `//` and block `/* */`)
  - All repetition operators (`{}`, `[]`, `()`)
  - Token expressions with regex, strings, and raw strings

- **Robust Parsing**: Handles edge cases like:
  - Empty productions (`A: ;`)
  - Productions starting with empty alternatives (`A: | B`)
  - Productions ending with empty alternatives (`A: B |`)
  - Mixed line and block comments
  - Complex scanner state transitions

- **Multiple Bindings**: Supports integration with:
  - Node.js/JavaScript
  - Python
  - Rust
  - Go
  - Swift
  - C/C++

## Installation

### Node.js

```bash
npm install tree-sitter-parol
```

### From Source

```bash
git clone https://github.com/jsinger67/tree-sitter-parol.git
cd tree-sitter-parol
npm install
npx tree-sitter generate
```

## Usage

### Command Line

Parse a Parol grammar file:

```bash
npx tree-sitter parse examples/example.par
```

### Node.js

```javascript
const Parser = require('tree-sitter');
const Parol = require('tree-sitter-parol');

const parser = new Parser();
parser.setLanguage(Parol);

const sourceCode = `
%start Expr
%title "Simple Calculator"

%%

Expr: Term { ('+' | '-') Term };
Term: Factor { ('*' | '/') Factor };
Factor: Number | '(' Expr ')';
Number: /\d+/;
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

### Python

```python
import tree_sitter_parol as ts_parol
from tree_sitter import Language, Parser

# Create the language object
PAROL_LANGUAGE = Language(ts_parol.language())

# Create a parser and set the language
parser = Parser(PAROL_LANGUAGE)

# Parse some Parol grammar code
source_code = b"""
%start Expr
%title "Simple Calculator"

%%

Expr: Term { ('+' | '-') Term };
Term: Factor { ('*' | '/') Factor };
Factor: Number | '(' Expr ')';
Number: /\d+/;
"""

# Parse and get the syntax tree
tree = parser.parse(source_code)

# Helper function to generate S-expression representation
def node_to_sexp(node):
    if node.child_count == 0:
        return f"({node.type})"
    children_sexp = " ".join(node_to_sexp(child) for child in node.children)
    return f"({node.type} {children_sexp})"

# Print the S-expression representation
print(node_to_sexp(tree.root_node))

# Or traverse the tree
root = tree.root_node
print(f"\nRoot node type: {root.type}")
for child in root.children:
    print(f"Child node type: {child.type}, Text: {child.text}"
```

### Rust

```rust
use tree_sitter::Parser;
use tree_sitter_parol::LANGUAGE;

fn main() {
    let mut parser = Parser::new();
    let language = LANGUAGE.into();
    parser
        .set_language(&language)
        .expect("Error loading Parol grammar");

    let source_code = r#"
%start Expr
%title "Simple Calculator"

%%

Expr: Term { ('+' | '-') Term };
Term: Factor { ('*' | '/') Factor };
Factor: Number | '(' Expr ')';
Number: /\d+/;
"#;

    let tree = parser.parse(source_code, None).unwrap();
    println!("{}", tree.root_node().to_sexp());
}
```

## Grammar Structure

The Parol language consists of two main sections:

### Prolog Section
- `%start` declaration (required)
- `%title` for grammar title
- `%comment` for version info
- `%line_comment` and `%block_comment` for comment syntax
- `%scanner` directives for additional scanner states
- `%on` declarations for transitions from scanner state INITIAL
- Scanner states for lexical modes

### Grammar Definition Section
- Productions with identifiers and alternations
- Factors including symbols, groups, repeats, and optionals
- Terminal symbols (strings, regex, raw strings)
- Non-terminal symbols (identifiers)
- AST control operators for tree shaping

## Example Parol Grammar

```parol
%start Calculator
%title "Simple Calculator Grammar"
%comment "A basic arithmetic calculator"
%line_comment '//'
%block_comment '/*' '*/'

%%

Calculator: Expr;

Expr: Term { ('+' | '-')^ Term };
Term: Factor { ('*' | '/')^ Factor };

Factor
    : Number
    | '(' Expr ')'
    | '-' Factor
    ;

Number: /\d+(\.\d+)?/;
```

## AST Node Types

The grammar generates various AST node types including:

- `parol` - Root node
- `prolog` - Declaration section
- `grammar_definition` - Grammar rules section
- `production` - Individual grammar rule
- `alternations` - Alternative patterns
- `alternation` - Single alternative
- `factor` - Grammar element
- `symbol` - Terminal or non-terminal
- `ast_control` - AST manipulation operators
- `scanner_state` - Lexical state definition

## Testing

The grammar has been tested against:

- The complete Parol self-hosting grammar
- Expanded grammar formats with numbered productions
- Complex examples with scanner states
- Edge cases with empty alternatives
- All test cases in the Parol repository

Run tests:

```bash
# Test against Parol's own grammar
npx tree-sitter parse ../parol/crates/parol/src/parser/parol.par

# Test against expanded format
npx tree-sitter parse ../parol/crates/parol/src/parser/parol-exp.par

# Test edge cases
npx tree-sitter parse ../parol/crates/parol/data/valid/test.par

# Test scanner states
npx tree-sitter parse ../parol/examples/scanner_states_lr/scanner_states.par
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development

1. Clone the repository
2. Make changes to `grammar.js`
3. Regenerate the parser: `npx tree-sitter generate`
4. Test your changes: `npx tree-sitter test`
5. Test against real Parol files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [Parol](https://github.com/jsinger67/parol) - The Parol parser generator
- [Tree-sitter](https://tree-sitter.github.io/) - The incremental parsing framework
- [tree-sitter-rust](https://github.com/tree-sitter/tree-sitter-rust) - Tree-sitter grammar for Rust

## Acknowledgments

- Thanks to the [Tree-sitter](https://tree-sitter.github.io/) team for the excellent parsing framework
- Thanks to [Jörg Singer](https://github.com/jsinger67) for creating the Parol parser generator
- Inspired by other Tree-sitter grammar implementations