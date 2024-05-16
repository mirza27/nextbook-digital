'use client'


export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  