"use client";

import { useEffect, useState } from "react";
import { getJobs } from "./storage";
import { Job, Region } from "./types";

export function useJobsByRegion(region: Region | null = null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getJobs().then((all) => {
      const active = all.filter((j) => !j.expired);
      setTotalCount(active.length);
      setJobs(region ? active.filter((j) => j.region === region) : active);
    });
  }, [region]);

  return { jobs, totalCount };
}
