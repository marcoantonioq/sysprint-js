import { SpoolRequest } from "../interface/SpoolsInterface";

export class Spool implements SpoolRequest {
  private constructor(
    public id: number = 0,
    public user: string = "",
    public print: string = "",
    public title: string | undefined = "",
    public copies: number | undefined = 1,
    public range: string | undefined = "",
    public quality: "3" | "4" | "5" = "4",
    public pages: "all" | "odd" | "even" | undefined = "all",
    public sided:
      | "one-sided"
      | "two-sided-long-edge"
      | "two-sided-short-edge"
      | undefined = "two-sided-long-edge",
    public media:
      | "letter"
      | "A3"
      | "A4"
      | "A5"
      | "legal"
      | "envelope"
      | "photo"
      | undefined = "A4",
    public orientation: "portrait" | "landscape" | undefined = undefined,
    public buffer: Buffer | undefined = undefined,
    public path: string | undefined = undefined,
    public msgs: string[] = [],
    public errors: string[] = []
  ) {}

  static create(options: Partial<SpoolRequest>): Spool {
    return Object.assign(new Spool(), { ...options });
  }
}
