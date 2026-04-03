import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

const PAYMENT_METHODS = [
  { value: "paypal", label: "PayPal", details: "karim.nabil@paypal.com" },
  { value: "instapay", label: "InstaPay", details: "karim.nabil@instapay" },
  { value: "vodafone_cash", label: "Vodafone Cash", details: "01012345678" },
] as const;

const PaymentForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("instapay");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      setError("Please upload a payment screenshot");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const fileExt = screenshot.name.split(".").pop();
      const fileName = `${Date.now()}_${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, screenshot);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("payment_submissions")
        .insert({
          full_name: fullName,
          email,
          phone,
          payment_method: paymentMethod as any,
          screenshot_url: urlData.publicUrl,
        });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <CheckCircle className="w-16 h-16 text-primary mx-auto" />
        <h3 className="text-2xl font-bold">Payment Submitted!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll review your payment and send you access details at <strong>{email}</strong> within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1" placeholder="Your full name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" placeholder="your@email.com" />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1" placeholder="+20 xxx xxx xxxx" />
      </div>

      <div>
        <Label>Payment Method</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setPaymentMethod(m.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                paymentMethod === m.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="font-semibold text-sm">{m.label}</span>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{m.details}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Payment Screenshot</Label>
        <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            {screenshot ? screenshot.name : "Click to upload screenshot"}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} />
        </label>
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Submit Payment
      </Button>
    </form>
  );
};

export default PaymentForm;
