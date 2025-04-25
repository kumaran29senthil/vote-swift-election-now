
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { toast } from './ui/use-toast';

interface TwoFactorAuthProps {
  userId: string;
  onSuccess: () => void;
}

const TwoFactorAuth = ({ userId, onSuccess }: TwoFactorAuthProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('verify_2fa', {
        user_id: userId,
        token: code
      });

      if (error) throw error;
      
      if (data) {
        toast({
          title: "Success",
          description: "2FA verification successful",
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: "Invalid 2FA code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during 2FA verification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
      <p className="text-sm text-muted-foreground">
        Please enter the verification code from your authenticator app.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputOTP value={code} onChange={setCode} maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
};

export default TwoFactorAuth;
