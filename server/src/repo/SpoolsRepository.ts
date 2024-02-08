import {
  InterfaceRepository,
  SpoolRequest,
} from "../interface/SpoolsInterface";
import { EventEmitter } from "events";
import { exec } from "child_process";
import { Spool } from "../core/Spools";
import path from "path";
import { lp } from "../app/cups/lp";

export class RepositorySpools implements InterfaceRepository {
  constructor(
    private readonly data: Spool[],
    public event: EventEmitter = new EventEmitter()
  ) {}
  async lp(options: SpoolRequest): Promise<Spool[]> {
    return [await lp(options)];
  }

  all(): Promise<SpoolRequest[]> {
    throw new Error("Method not implemented.");
  }
}
