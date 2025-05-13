
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

interface EmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSubmit: (email: string, optIn: boolean) => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ isOpen, onClose, event, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(email, optIn);
    
    // Reset form
    setEmail("");
    setOptIn(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Tickets</DialogTitle>
          <DialogDescription>
            Enter your email to continue to the ticket page for {event?.title}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="opt-in" 
                checked={optIn}
                onCheckedChange={(checked) => setOptIn(checked === true)}
              />
              <Label htmlFor="opt-in" className="text-sm">
                I agree to receive updates about events in Sydney.
              </Label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Continue to Tickets</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
