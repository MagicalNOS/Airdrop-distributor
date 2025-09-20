import type { Metadata } from "next";
import "./globals.css";
import React, { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TS Sender",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
