import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { SESSION_COOKIE } from "@/features/auth/utils/constants";

function makeRequest(url: string, withCookie = false): NextRequest {
  const headers = new Headers();
  if (withCookie) {
    headers.set("cookie", `${SESSION_COOKIE}=sometoken`);
  }
  return new NextRequest(url, { headers });
}

describe("middleware", () => {
  it("redirects to /login when session cookie is absent", () => {
    const request = makeRequest("http://localhost/dashboard");
    const response = middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("redirects to /login when accessing /admin without session cookie", () => {
    const request = makeRequest("http://localhost/admin/dashboard");
    const response = middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });

  it("passes through when session cookie is present", () => {
    const request = makeRequest("http://localhost/dashboard", true);
    const response = middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("passes through for /admin when session cookie is present", () => {
    const request = makeRequest("http://localhost/admin/users", true);
    const response = middleware(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects to /login when session cookie is present but empty", () => {
    const request = new NextRequest("http://localhost/dashboard", {
      headers: new Headers({ cookie: `${SESSION_COOKIE}=` }),
    });
    const response = middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login");
  });
});
