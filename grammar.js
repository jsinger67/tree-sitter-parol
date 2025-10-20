/**
 * @file Tree-sitter parser for parol language
 * @author Joerg Singer <singer.joerg@gmx.de>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tree_sitter_parol",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
