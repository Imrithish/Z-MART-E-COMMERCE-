"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Save, X } from "lucide-react";
import { aiProductDescriptionGenerator } from "@/ai/flows/ai-product-description-generator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ProductForm({ initialData }: { initialData?: any }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    features: '',
  });

  const generateDescription = async () => {
    if (!formData.name) {
      toast({
        title: "Product name required",
        description: "Please enter a product name before generating a description.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiProductDescriptionGenerator({
        productName: formData.name,
        keyFeatures: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        additionalNotes: "Professional, persuasive, and SEO-friendly.",
      });
      setFormData({ ...formData, description: result.description });
      toast({
        title: "Description generated",
        description: "AI has successfully created a product description for you.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate description at this time.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Product Saved", description: "Your product listing has been updated." });
      router.push('/admin/products');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Premium Noise Cancelling Headphones" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Level</Label>
              <Input 
                id="stock" 
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="0" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData({...formData, category: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="features">Key Features (comma separated)</Label>
            <Input 
              id="features" 
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="Noise cancelling, Bluetooth 5.0, 40h battery" 
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Product Description</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={generateDescription}
                disabled={isGenerating}
                className="gap-2 bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate with AI
              </Button>
            </div>
            <Textarea 
              id="description" 
              rows={8} 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell customers about your product..."
              className="resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isLoading} className="gap-2 px-8 h-11">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Product
        </Button>
      </div>
    </form>
  );
}