import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Monitor, Brain, Download, ExternalLink } from 'lucide-react';

// Social platform configuration
const SOCIAL_PLATFORMS = [
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@username' },
  { key: 'twitter', label: 'Twitter (X)', placeholder: 'https://twitter.com/username' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { key: 'reddit', label: 'Reddit', placeholder: 'https://reddit.com/u/username' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
];

// Types for our data structures
interface SocialLinks {
  [key: string]: string;
}

interface InfluencerEntry {
  id: string;
  name: string;
  socialLinks: SocialLinks;
}

interface CompetitorEntry {
  id: string;
  name: string;
  socialLinks: SocialLinks;
}

interface FormData {
  brandName: string;
  influencers: InfluencerEntry[];
  competitors: CompetitorEntry[];
  useAI: 'yes' | 'no';
}

const BrandMonitoringDashboard: React.FC = () => {
  // State management
  const [brandName, setBrandName] = useState('');
  const [influencers, setInfluencers] = useState<InfluencerEntry[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [useAI, setUseAI] = useState<'yes' | 'no'>('yes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const { toast } = useToast();

  // Add a new influencer entry
  const addInfluencer = () => {
    const newInfluencer: InfluencerEntry = {
      id: Date.now().toString(),
      name: '',
      socialLinks: {},
    };
    setInfluencers([...influencers, newInfluencer]);
  };

  // Remove an influencer entry
  const removeInfluencer = (id: string) => {
    setInfluencers(influencers.filter(inf => inf.id !== id));
  };

  // Update influencer name
  const updateInfluencerName = (id: string, name: string) => {
    setInfluencers(influencers.map(inf => 
      inf.id === id ? { ...inf, name } : inf
    ));
  };

  // Update social link for an influencer
  const updateInfluencerSocialLink = (id: string, platform: string, url: string) => {
    setInfluencers(influencers.map(inf => 
      inf.id === id 
        ? { ...inf, socialLinks: { ...inf.socialLinks, [platform]: url } }
        : inf
    ));
  };

  // Add a new competitor entry
  const addCompetitor = () => {
    const newCompetitor: CompetitorEntry = {
      id: Date.now().toString(),
      name: '',
      socialLinks: {},
    };
    setCompetitors([...competitors, newCompetitor]);
  };

  // Remove a competitor entry
  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter(comp => comp.id !== id));
  };

  // Update competitor name
  const updateCompetitorName = (id: string, name: string) => {
    setCompetitors(competitors.map(comp => 
      comp.id === id ? { ...comp, name } : comp
    ));
  };

  // Update social link for a competitor
  const updateCompetitorSocialLink = (id: string, platform: string, url: string) => {
    setCompetitors(competitors.map(comp => 
      comp.id === id 
        ? { ...comp, socialLinks: { ...comp.socialLinks, [platform]: url } }
        : comp
    ));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate brand name (mandatory)
    if (!brandName.trim()) {
      newErrors.brandName = 'Brand name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate CSV format data
  const generateCSV = (data: FormData): string => {
    let csv = 'brand,type,name,youtube,instagram,reddit,twitter,linkedin\n';
    
    // Process influencers
    data.influencers.forEach(influencer => {
      if (influencer.name.trim()) {
        const youtube = influencer.socialLinks.youtube || '';
        const instagram = influencer.socialLinks.instagram || '';
        const reddit = influencer.socialLinks.reddit || '';
        const twitter = influencer.socialLinks.twitter || '';
        const linkedin = influencer.socialLinks.linkedin || '';
        
        csv += `${data.brandName},Influencer,${influencer.name},${youtube},${instagram},${reddit},${twitter},${linkedin}\n`;
      }
    });
    
    // Process competitors
    data.competitors.forEach(competitor => {
      if (competitor.name.trim()) {
        const youtube = competitor.socialLinks.youtube || '';
        const instagram = competitor.socialLinks.instagram || '';
        const reddit = competitor.socialLinks.reddit || '';
        const twitter = competitor.socialLinks.twitter || '';
        const linkedin = competitor.socialLinks.linkedin || '';
        
        csv += `${data.brandName},Competitor,${competitor.name},${youtube},${instagram},${reddit},${twitter},${linkedin}\n`;
      }
    });
    
    return csv;
  };

  // Simulate API call to save curator list
  const submitCuratorList = async (data: FormData): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form Data Submitted:', data);
        console.log('CSV Format:', generateCSV(data));
        
        // Simulate successful submission with analysis ID
        const mockAnalysisId = 'analysis_' + Date.now();
        resolve(mockAnalysisId);
      }, 1500);
    });
  };

  // Simulate AI model processing
  const triggerModelProcessing = (analysisId: string, useAI: boolean) => {
    if (useAI) {
      console.log(`Triggering AI model processing for analysis ID: ${analysisId}`);
      
      // Simulate processing time
      setTimeout(() => {
        setIsAnalysisReady(true);
        toast({
          title: "Analysis Complete",
          description: "Your brand monitoring analysis is ready to view.",
        });
      }, 3000);
    } else {
      // Without AI, analysis is ready immediately
      setIsAnalysisReady(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const formData: FormData = {
      brandName: brandName.trim(),
      influencers: influencers.filter(inf => inf.name.trim() !== ''),
      competitors: competitors.filter(comp => comp.name.trim() !== ''),
      useAI,
    };

    try {
      const analysisId = await submitCuratorList(formData);
      setAnalysisId(analysisId);
      
      toast({
        title: "Submission Successful",
        description: "Your curator list has been saved successfully.",
      });

      // Trigger model processing
      triggerModelProcessing(analysisId, useAI === 'yes');

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error saving your curator list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch analysis from backend
  const showAnalysis = async () => {
    if (!analysisId || isAnalysisLoading) return;

    setIsAnalysisLoading(true);
    setAnalysisResult(null);

    const formData: FormData = {
      brandName: brandName.trim(),
      influencers: influencers.filter(inf => inf.name.trim() !== ''),
      competitors: competitors.filter(comp => comp.name.trim() !== ''),
      useAI,
    };
    const csvContent = generateCSV(formData);

    try {
      const resp = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: (() => {
          const data = new FormData();
          const blob = new Blob([csvContent], { type: 'text/csv' });
          data.append('file', blob, 'curatorlist.csv');
          return data;
        })(),
      });
      if (!resp.ok) throw new Error('Analysis failed');
      const result = await resp.json();
      setAnalysisResult(result.analysis);

      // Open analysis in a new window/tab
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Brand Monitoring Analysis - ${brandName}</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  max-width: 800px; 
                  margin: 20px auto; 
                  padding: 20px; 
                  background: #f5f5f5; 
                  line-height: 1.6;
                }
                pre { 
                  background: white; 
                  padding: 20px; 
                  border-radius: 8px; 
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <pre>${result.analysis.replace(/</g, '&lt;')}</pre>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (err) {
      toast({
        title: "Analysis Failed",
        description: "There was an error running the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Download CSV function
  const downloadCSV = () => {
    const formData: FormData = {
      brandName: brandName.trim(),
      influencers: influencers.filter(inf => inf.name.trim() !== ''),
      competitors: competitors.filter(comp => comp.name.trim() !== ''),
      useAI,
    };
    
    const csvContent = generateCSV(formData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.replace(/\s+/g, '_')}_curator_list.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Brand Monitoring Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Build your curator list for comprehensive brand and competitor analysis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mandatory Brand Name Field */}
          <Card className="border-primary/20 shadow-glow animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-destructive">*</span>
                Brand Information
              </CardTitle>
              <CardDescription>
                Enter your brand name to get started with monitoring setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-base font-medium">
                  Your Brand Name (Mandatory)
                </Label>
                <Input
                  id="brandName"
                  type="text"
                  placeholder="Enter your brand name..."
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className={`h-12 text-lg transition-smooth ${
                    errors.brandName ? 'border-destructive' : 'focus:border-primary'
                  }`}
                />
                {errors.brandName && (
                  <p className="text-destructive text-sm animate-slide-up">
                    {errors.brandName}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Influencers Section */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Influencers</CardTitle>
              <CardDescription>
                Add influencers to monitor. Social platform links will appear when you start typing a name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {influencers.map((influencer, index) => (
                <div key={influencer.id} className="space-y-4 p-4 border rounded-lg animate-scale-in">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`influencer-${influencer.id}`} className="text-sm font-medium">
                        Influencer Name #{index + 1}
                      </Label>
                      <Input
                        id={`influencer-${influencer.id}`}
                        type="text"
                        placeholder="Enter influencer name..."
                        value={influencer.name}
                        onChange={(e) => updateInfluencerName(influencer.id, e.target.value)}
                        className="transition-smooth"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeInfluencer(influencer.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Conditional Social Platform Fields */}
                  {influencer.name.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-primary/30 animate-slide-up">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Social Platform Links (Optional)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <div key={platform.key} className="space-y-1">
                            <Label 
                              htmlFor={`${influencer.id}-${platform.key}`}
                              className="text-xs text-muted-foreground"
                            >
                              {platform.label}
                            </Label>
                            <Input
                              id={`${influencer.id}-${platform.key}`}
                              type="url"
                              placeholder={platform.placeholder}
                              value={influencer.socialLinks[platform.key] || ''}
                              onChange={(e) => updateInfluencerSocialLink(influencer.id, platform.key, e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addInfluencer}
                className="w-full border-dashed border-2 hover:border-primary transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Influencer
              </Button>
            </CardContent>
          </Card>

          {/* Competitors Section */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Competitors</CardTitle>
              <CardDescription>
                Add competitors to monitor. Social platform links will appear when you start typing a name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {competitors.map((competitor, index) => (
                <div key={competitor.id} className="space-y-4 p-4 border rounded-lg animate-scale-in">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor={`competitor-${competitor.id}`} className="text-sm font-medium">
                        Competitor Name #{index + 1}
                      </Label>
                      <Input
                        id={`competitor-${competitor.id}`}
                        type="text"
                        placeholder="Enter competitor name..."
                        value={competitor.name}
                        onChange={(e) => updateCompetitorName(competitor.id, e.target.value)}
                        className="transition-smooth"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCompetitor(competitor.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Conditional Social Platform Fields */}
                  {competitor.name.length > 0 && (
                    <div className="space-y-3 pl-4 border-l-2 border-primary/30 animate-slide-up">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Social Platform Links (Optional)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <div key={platform.key} className="space-y-1">
                            <Label 
                              htmlFor={`${competitor.id}-${platform.key}`}
                              className="text-xs text-muted-foreground"
                            >
                              {platform.label}
                            </Label>
                            <Input
                              id={`${competitor.id}-${platform.key}`}
                              type="url"
                              placeholder={platform.placeholder}
                              value={competitor.socialLinks[platform.key] || ''}
                              onChange={(e) => updateCompetitorSocialLink(competitor.id, platform.key, e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addCompetitor}
                className="w-full border-dashed border-2 hover:border-primary transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Competitor
              </Button>
            </CardContent>
          </Card>

          {/* AI Usage Selection */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Analysis Options
              </CardTitle>
              <CardDescription>
                Choose whether to use AI for curator list suggestions and enhanced analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={useAI} onValueChange={(value: 'yes' | 'no') => setUseAI(value)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value="yes" id="ai-yes" />
                  <Label htmlFor="ai-yes" className="flex-1 cursor-pointer">
                    <div className="font-medium">Yes, use AI suggestions</div>
                    <div className="text-sm text-muted-foreground">
                      Get AI-powered recommendations and enhanced analysis
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <RadioGroupItem value="no" id="ai-no" />
                  <Label htmlFor="ai-no" className="flex-1 cursor-pointer">
                    <div className="font-medium">No, manual setup only</div>
                    <div className="text-sm text-muted-foreground">
                      Use basic monitoring without AI recommendations
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-primary hover:shadow-glow transition-smooth"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Curator List'}
              </Button>
              
              {brandName && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadCSV}
                  className="hover:border-primary transition-smooth"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </div>

            {analysisId && (
              <Button
                type="button"
                variant="secondary"
                onClick={showAnalysis}
                disabled={!isAnalysisReady || isAnalysisLoading}
                className="bg-gradient-accent hover:shadow-glow transition-smooth"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isAnalysisReady
                  ? (isAnalysisLoading ? 'Loading...' : 'Show Analysis')
                  : 'Processing...'}
              </Button>
            )}
          </div>
        </form>

        {/* Status Information */}
        {analysisId && (
          <Card className="mt-8 border-primary/20 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isAnalysisReady ? 'bg-primary' : 'bg-accent animate-pulse'}`} />
                <span className="text-sm">
                  Analysis Status: {isAnalysisReady ? 'Ready' : 'Processing...'}
                </span>
                {!isAnalysisReady && useAI === 'yes' && (
                  <span className="text-xs text-muted-foreground">
                    AI analysis in progress, this may take a few minutes
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Report Output */}
        {analysisResult && (
          <Card className="mt-8 border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle>Brand Analysis Report</CardTitle>
            </CardHeader>
            <CardContent>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: 'white',
                  color: '#222',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  overflowX: 'auto',
                }}
              >
                {analysisResult}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrandMonitoringDashboard;