"use client";

import { useState } from "react";
import { submitRsvp } from "../../actions/submit-rsvp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

type Props = {
  publicToken: string;
  rsvpOptions: Record<string, string>;
  guestSlug?: string;
  guestName?: string;
};

export function RsvpForm({ publicToken, rsvpOptions, guestSlug, guestName }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(guestName ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [response, setResponse] = useState<"ACCEPT" | "DECLINE" | "MAYBE">(
    "ACCEPT",
  );
  const [guests, setGuests] = useState("1");
  const [hope, setHope] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await submitRsvp(
      publicToken,
      {
        name,
        phoneNumber,
        response,
        guests,
        hope,
      },
      guestSlug,
    );
    setLoading(false);
    if (result.errors) {
      setErrors(result.errors as Record<string, string[]>);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-semibold text-lg">Thank you for your response!</p>
          <p className="text-sm text-muted-foreground mt-1">
            We look forward to celebrating with you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="rsvp-name">Your Name *</Label>
            <Input
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="rsvp-phone">Phone (optional)</Label>
            <Input
              id="rsvp-phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08xxxxxxxxxx"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-destructive mt-1">
                {errors.phoneNumber[0]}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">Will you attend?</Label>
            <RadioGroup
              value={response}
              onValueChange={(v) => setResponse(v as typeof response)}
              className="flex gap-4"
            >
              {rsvpOptions.accept && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="ACCEPT" id="accept" />
                  <Label htmlFor="accept">Accept</Label>
                </div>
              )}
              {rsvpOptions.maybe && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="MAYBE" id="maybe" />
                  <Label htmlFor="maybe">Maybe</Label>
                </div>
              )}
              {rsvpOptions.decline && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="DECLINE" id="decline" />
                  <Label htmlFor="decline">Decline</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {rsvpOptions.plusOne && (
            <div>
              <Label htmlFor="rsvp-guests">Number of guests</Label>
              <Input
                id="rsvp-guests"
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label htmlFor="rsvp-hope">Wishes (optional)</Label>
            <Textarea
              id="rsvp-hope"
              value={hope}
              onChange={(e) => setHope(e.target.value)}
              placeholder="Your wishes for the couple"
            />
          </div>

          {errors._form && (
            <p className="text-xs text-destructive">{errors._form[0]}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit RSVP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
