import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Problem {
  title: string;
  description: string;
  visibleTestCases: { input: string; output: string }[];
  hiddenTestCases: { input: string; output: string }[];
}

export function CreateHackathonForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [instructions, setInstructions] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [orgImage, setOrgImage] = useState<File | null>(null);
  const [prizeMoney, setPrizeMoney] = useState("");
  const [offerings, setOfferings] = useState<string[]>([""]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddProblem = () => {
    if (problems.length < 3) {
      setProblems([
        ...problems,
        {
          title: "",
          description: "",
          visibleTestCases: [{ input: "", output: "" }],
          hiddenTestCases: [{ input: "", output: "" }],
        },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let bannerImageUrl = null;
      let orgImageUrl = null;

      if (bannerImage) {
        const { data: bannerData, error: bannerError } = await supabase.storage
          .from("hackathon-images")
          .upload(`banner/${Date.now()}-${bannerImage.name}`, bannerImage);

        if (bannerError) throw bannerError;
        bannerImageUrl = bannerData.path;
      }

      if (orgImage) {
        const { data: orgData, error: orgError } = await supabase.storage
          .from("hackathon-images")
          .upload(`org/${Date.now()}-${orgImage.name}`, orgImage);

        if (orgError) throw orgError;
        orgImageUrl = orgData.path;
      }

      const { data: hackathon, error: hackathonError } = await supabase
        .from("hackathons")
        .insert([
          {
            title,
            description,
            start_date: startDate?.toISOString(),
            end_date: endDate?.toISOString(),
            rules: instructions,
            status: "upcoming",
            banner_image_url: bannerImageUrl,
            organization_image_url: orgImageUrl,
            prize_money: Number(prizeMoney),
            offerings,
          },
        ])
        .select()
        .single();

      if (hackathonError) throw hackathonError;

      // Insert problems and test cases
      for (const problem of problems) {
        const { data: questionData, error: questionError } = await supabase
          .from("hackathon_questions")
          .insert([
            {
              hackathon_id: hackathon.id,
              title: problem.title,
              description: problem.description,
            },
          ])
          .select()
          .single();

        if (questionError) throw questionError;

        // Insert test cases
        const testCases = [
          ...problem.visibleTestCases.map(tc => ({ ...tc, is_hidden: false })),
          ...problem.hiddenTestCases.map(tc => ({ ...tc, is_hidden: true })),
        ];

        const { error: testCaseError } = await supabase
          .from("hackathon_test_cases")
          .insert(
            testCases.map(tc => ({
              question_id: questionData.id,
              input: tc.input,
              expected_output: tc.output,
              is_hidden: tc.is_hidden,
            }))
          );

        if (testCaseError) throw testCaseError;
      }

      toast({
        title: "Success",
        description: "Hackathon created successfully!",
      });

      navigate("/hackathons");
    } catch (error) {
      console.error("Error creating hackathon:", error);
      toast({
        title: "Error",
        description: "Failed to create hackathon. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Hackathon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hackathon Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Logo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setOrgImage(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prize Money</label>
            <Input
              type="number"
              value={prizeMoney}
              onChange={(e) => setPrizeMoney(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">What You Offer</h3>
              <Button
                type="button"
                onClick={() => setOfferings([...offerings, ""])}
              >
                Add Offering
              </Button>
            </div>
            {offerings.map((offering, index) => (
              <Input
                key={index}
                value={offering}
                onChange={(e) => {
                  const newOfferings = [...offerings];
                  newOfferings[index] = e.target.value;
                  setOfferings(newOfferings);
                }}
                placeholder={`Offering ${index + 1}`}
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Problems</h3>
              <Button
                type="button"
                onClick={handleAddProblem}
                disabled={problems.length >= 3}
              >
                Add Problem
              </Button>
            </div>

            {problems.map((problem, index) => (
              <Card key={index}>
                <CardContent className="space-y-4 pt-6">
                  <Input
                    placeholder="Problem Title"
                    value={problem.title}
                    onChange={(e) => {
                      const newProblems = [...problems];
                      newProblems[index].title = e.target.value;
                      setProblems(newProblems);
                    }}
                  />
                  <Textarea
                    placeholder="Problem Description"
                    value={problem.description}
                    onChange={(e) => {
                      const newProblems = [...problems];
                      newProblems[index].description = e.target.value;
                      setProblems(newProblems);
                    }}
                  />

                  <div className="space-y-2">
                    <h4 className="font-medium">Visible Test Cases</h4>
                    {problem.visibleTestCases.map((tc, tcIndex) => (
                      <div key={tcIndex} className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Input"
                          value={tc.input}
                          onChange={(e) => {
                            const newProblems = [...problems];
                            newProblems[index].visibleTestCases[tcIndex].input =
                              e.target.value;
                            setProblems(newProblems);
                          }}
                        />
                        <Input
                          placeholder="Expected Output"
                          value={tc.output}
                          onChange={(e) => {
                            const newProblems = [...problems];
                            newProblems[index].visibleTestCases[tcIndex].output =
                              e.target.value;
                            setProblems(newProblems);
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Hidden Test Cases</h4>
                    {problem.hiddenTestCases.map((tc, tcIndex) => (
                      <div key={tcIndex} className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Input"
                          value={tc.input}
                          onChange={(e) => {
                            const newProblems = [...problems];
                            newProblems[index].hiddenTestCases[tcIndex].input =
                              e.target.value;
                            setProblems(newProblems);
                          }}
                        />
                        <Input
                          placeholder="Expected Output"
                          value={tc.output}
                          onChange={(e) => {
                            const newProblems = [...problems];
                            newProblems[index].hiddenTestCases[tcIndex].output =
                              e.target.value;
                            setProblems(newProblems);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Instructions</label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Hackathon
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}