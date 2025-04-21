"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/api/watchlist";
import { useToast } from "@/components/ui/use-toast";

interface WatchlistButtonProps {
  businessId: string;
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  translations: {
    addToWatchlist: string;
    removeFromWatchlist: string;
    addedToWatchlist: string;
    removedFromWatchlist: string;
    error: string;
  };
}

export function WatchlistButton({
  businessId,
  userId,
  variant = "outline",
  size = "sm",
  className = "",
  translations
}: WatchlistButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if business is in watchlist when component mounts
    const checkWatchlist = async () => {
      if (!userId) return;
      
      try {
        const watching = await isInWatchlist(userId, businessId);
        setIsWatching(watching);
      } catch (error) {
        console.error("Error checking watchlist status:", error);
      }
    };

    checkWatchlist();
  }, [businessId, userId]);

  const toggleWatchlist = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      if (isWatching) {
        await removeFromWatchlist(userId, businessId);
        setIsWatching(false);
        toast({
          title: translations.removedFromWatchlist,
          variant: "default",
        });
      } else {
        await addToWatchlist(userId, businessId);
        setIsWatching(true);
        toast({
          title: translations.addedToWatchlist,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
      toast({
        title: translations.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-1 ${className}`}
      onClick={toggleWatchlist}
      disabled={isLoading || !userId}
    >
      {isWatching ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>{translations.removeFromWatchlist}</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>{translations.addToWatchlist}</span>
        </>
      )}
    </Button>
  );
}
