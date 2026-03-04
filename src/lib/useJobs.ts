"use client";

import { useEffect, useState } from "react";
import { getJobs } from "./storage";
import { Job } from "./types";

export function useJobsByCategory(category: Job["category"]) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getJobs().then((all) => {
      const active = all.filter((j) => !j.expired);
      setJobs(active.filter((j) => j.category === category));
      setTotalCount(active.length);
    });
  }, [category]);

  return { jobs, totalCount };
}
