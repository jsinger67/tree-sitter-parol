/**
 * @file Tree-sitter parser for parol language
 * @author Joerg Singer <singer.joerg@gmx.de>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

// @ts-check

module.exports = grammar({
  name: "tree_sitter_parol",

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    // The start symbol
    parol: $ => seq(
      $.prolog,
      $.grammar_definition
    ),

    prolog: $ => seq(
      $.start_declaration,
      repeat($.declaration),
      repeat($.scanner_state)
    ),

    start_declaration: $ => seq(
      "%start",
      $.identifier
    ),

    declaration: $ => choice(
      seq("%title", $.string),
      seq("%comment", $.string),
      seq("%user_type", $.identifier, "=", $.user_type_name),
      seq("%nt_type", field("nt_name", $.identifier), "=", field("nt_type", $.user_type_name)),
      seq("%t_type", field("t_type", $.user_type_name)),
      seq("%grammar_type", $.raw_string),
      $.scanner_directives
    ),

    scanner_directives: $ => choice(
      seq("%line_comment", $.token_literal),
      seq("%block_comment", $.token_literal, $.token_literal),
      "%auto_newline_off",
      "%auto_ws_off",
      seq("%on", $.identifier_list, $.scanner_state_directives),
      "%allow_unmatched"
    ),

    scanner_state_directives: $ => choice(
      seq("%enter", $.identifier),
      seq("%push", $.identifier),
      "%pop"
    ),

    grammar_definition: $ => seq(
      "%%",
      $.production,
      repeat($.production)
    ),

    double_colon: $ => "::",

    production: $ => seq(
      $.identifier,
      ":",
      optional(choice(
        $.alternations,
        seq("|", $.alternations)
      )),
      ";"
    ),

    alternations: $ => seq(
      $.alternation,
      repeat(seq("|", $.alternation)),
      optional("|")  // Allow trailing | for empty final alternative
    ),

    alternation: $ => repeat1($.factor),

    factor: $ => choice(
      $.group,
      $.repeat,
      $.optional,
      $.symbol
    ),

    symbol: $ => choice(
      $.non_terminal,
      $.simple_token,
      $.token_with_states
    ),

    token_literal: $ => choice(
      $.string,
      $.raw_string,
      $.regex
    ),

    token_expression: $ => seq(
      $.token_literal,
      optional($.look_ahead)
    ),

    simple_token: $ => seq(
      $.token_expression,
      optional($.ast_control)
    ),

    token_with_states: $ => seq(
      "<",
      $.identifier_list,
      ">",
      $.token_expression,
      optional($.ast_control)
    ),

    string: $ => /"(\\.|[^"])*"/,

    raw_string: $ => /'(\\.|[^'])*'/,

    regex: $ => /\/(\\.|[^\/])*\//,

    group: $ => seq(
      "(",
      optional($.alternations),
      ")"
    ),

    optional: $ => seq(
      "[",
      optional($.alternations),
      "]"
    ),

    repeat: $ => seq(
      "{",
      optional($.alternations),
      "}"
    ),

    non_terminal: $ => seq(
      $.identifier,
      optional($.ast_control)
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    scanner_state: $ => seq(
      "%scanner",
      field("state_name", $.identifier),
      "{",
      repeat($.scanner_directives),
      "}"
    ),

    identifier_list: $ => seq(
      $.identifier,
      repeat(seq(",", $.identifier))
    ),

    ast_control: $ => choice(
      $.cut_operator,
      seq($.member_name, optional($.user_type_declaration)),
      $.user_type_declaration
    ),

    member_name: $ => seq(
      "@",
      $.identifier
    ),

    cut_operator: $ => "^",

    user_type_declaration: $ => seq(
      ":",
      $.user_type_name
    ),

    user_type_name: $ => seq(
      $.identifier,
      repeat(seq($.double_colon, $.identifier))
    ),

    look_ahead: $ => seq(
      choice($.positive_lookahead, $.negative_lookahead),
      $.token_literal
    ),

    positive_lookahead: $ => "?=",

    negative_lookahead: $ => "?!",

    // Comments
    line_comment: $ => /\/\/[^\r\n]*/,

    block_comment: $ => /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
  }
});
