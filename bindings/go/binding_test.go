package tree_sitter_tree_sitter_parol_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tree_sitter_parol "github.com/jsinger67/parol/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tree_sitter_parol.Language())
	if language == nil {
		t.Errorf("Error loading Parol grammar")
	}
}
