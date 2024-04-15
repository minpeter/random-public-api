"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { ReloadIcon } from "@radix-ui/react-icons";

import { Button, buttonVariants } from "@/components/ui/button";

import { useEffect, useState } from "react";
import Link from "next/link";

type LinkState = "Checking" | "Valid" | "Invalid";

let storeData: any[] = [];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [randomData, setRandomData] = useState<any>(null);
  const [urlState, setUrlState] = useState<LinkState>("Checking");

  useEffect(() => {
    fetch("/api/resources.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.entries);
        storeData = data.entries;
        NewRandom();
      });
  }, []);

  function NewRandom() {
    setLoading(true);
    setUrlState("Checking");

    const rd = storeData.sort(() => Math.random() - 0.5)[0];

    setRandomData(rd);

    fetch(rd?.Link)
      .then((res) => {
        if (res.ok) {
          setUrlState("Valid");
        }
      })
      .catch(() => {
        setUrlState("Invalid");
      });

    setLoading(false);
  }

  return (
    <Card>
      {loading ? (
        <CardHeader>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardHeader>
      ) : (
        <>
          <CardHeader>
            <CardTitle>{randomData?.API}</CardTitle>
            <CardDescription>{randomData?.Description}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            {urlState === "Checking" && (
              <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            )}
            {urlState === "Valid" && (
              <Link
                href={randomData.Link}
                target="_blank"
                className={buttonVariants()}
              >
                Check it out
              </Link>
            )}
            {urlState === "Invalid" &&
              (randomData?.Cors ? (
                <Link
                  href={randomData.Link}
                  target="_blank"
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Plz Manual Check
                </Link>
              ) : (
                <>
                  <Button disabled>URL is invalid</Button>
                </>
              ))}
            <Button variant="outline" size="icon" onClick={NewRandom}>
              <ReloadIcon className="h-4 w-4" />
            </Button>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Badge variant="outline">{randomData?.Category}</Badge>
            <Badge variant="outline">{randomData?.Auth || "No Auth"}</Badge>
            <Badge variant="outline">
              {randomData?.Cors ? "CORS" : "No CORS"}
            </Badge>
            <Badge variant="outline">
              {randomData?.HTTPS ? "HTTPS" : "HTTP"}
            </Badge>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
