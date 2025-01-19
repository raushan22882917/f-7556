import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Filter } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { AppSidebar } from '@/components/AppSidebar';

type Job = Tables<'jobs'>;

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Find your <span className="text-blue-500">new job</span> today
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thousands of jobs in the computer engineering and technology sectors are waiting for you.
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="What position are you looking for?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Search job
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Filters Section */}
            <div className="w-64 space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Location</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        Remote job
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        On-site
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Salary</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        $30000k
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        $50000k
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        $80000k
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        $100000k
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Type of employment</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        Full-time
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        Part-time
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="rounded" />
                        Contract
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List Section */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {filteredJobs?.length || 0} Jobs
                </h2>
                <select className="border rounded-md px-3 py-1 dark:bg-gray-800 dark:text-white">
                  <option>Filter by</option>
                  <option>Most recent</option>
                  <option>Highest paid</option>
                </select>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs?.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <img
                              src={job.company_logo_url || '/placeholder.svg'}
                              alt={job.company_name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{job.job_title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{job.company_name}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-gray-900 dark:text-white">{job.salary_range}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{job.description}</p>
                            <div className="flex gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" /> {job.job_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;