"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function WishlistButton({ product, className }: { product: any, className?: string }) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const wishlistDocRef = useMemo(() => {
    if (!db || !user?.uid || !product?.id) return null;
    return doc(db, 'users', user.uid, 'wishlist', product.id);
  }, [db, user?.uid, product?.id]);

  const { data: wishlistItem } = useDoc(wishlistDocRef);
  const isWishlisted = !!wishlistItem;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({ title: "Please Login", description: "You must be logged in to save items to your wishlist.", variant: "destructive" });
      return;
    }
    
    if (!db || !wishlistDocRef) return;
    
    setIsUpdating(true);
    try {
      if (isWishlisted) {
        await deleteDoc(wishlistDocRef);
        toast({ title: "Removed from Wishlist", description: `${product.name} has been removed.` });
      } else {
        await setDoc(wishlistDocRef, {
           id: product.id,
           name: product.name || '',
           price: product.price || 0,
           imageUrl: product.imageUrl || '',
           addedAt: new Date().toISOString()
        });
        toast({ title: "Added to Wishlist", description: `${product.name} is saved for later!` });
      }
    } catch (error) {
       console.error("Wishlist error:", error);
       toast({ title: "Error", description: "Could not update wishlist.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/10 hover:bg-white shadow-sm border-none hover:scale-110 transition-all z-10", className)}
      onClick={toggleWishlist}
      disabled={isUpdating}
    >
      <Heart className={cn("h-4 w-4 md:h-5 md:w-5 transition-colors", isWishlisted ? "fill-red-500 text-red-500 border-red-500" : "text-slate-400 hover:text-red-500")} />
    </Button>
  );
}
