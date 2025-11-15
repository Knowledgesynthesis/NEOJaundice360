import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { glossaryTerms, searchGlossary, getGlossaryCategories } from '@/data/glossary';
import { Search } from 'lucide-react';

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...getGlossaryCategories()];

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = searchTerm === '' || searchGlossary(searchTerm).includes(term);
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTerms = [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Glossary</h1>
        <p className="text-muted-foreground">
          Quick reference for key terms and concepts
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedTerms.length} of {glossaryTerms.length} terms
      </div>

      {/* Glossary Terms */}
      <div className="space-y-4">
        {sortedTerms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No terms found matching your search.
            </CardContent>
          </Card>
        ) : (
          sortedTerms.map((term) => (
            <Card key={term.term} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  <Badge variant="outline">{term.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{term.definition}</p>
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Related Terms:</p>
                    <div className="flex flex-wrap gap-1">
                      {term.relatedTerms.map((related) => (
                        <Badge
                          key={related}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => setSearchTerm(related)}
                        >
                          {related}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Categories Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Term categories in this glossary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Basic:</strong> Fundamental concepts and definitions
            </div>
            <div>
              <strong>Physiology:</strong> Bilirubin metabolism and pathways
            </div>
            <div>
              <strong>Etiology:</strong> Causes and types of jaundice
            </div>
            <div>
              <strong>Diagnosis:</strong> Diagnostic tests and findings
            </div>
            <div>
              <strong>Management:</strong> Treatment modalities
            </div>
            <div>
              <strong>Complications:</strong> Adverse outcomes and risks
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
