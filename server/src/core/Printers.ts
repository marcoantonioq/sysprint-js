import { PrintData } from "../interface/PrintersInterface";

export class Printer implements PrintData {
  users = {
    allow: ["1934155"],
    deny: [],
  };
  private constructor(
    public name: string = "",
    public location: string = "",
    public description: string = "",
    public model: string = "",
    public driver: string = "",
    public status: string = "",
    public info: string = ""
  ) {}

  static create(settings: Partial<PrintData>): Printer {
    return Object.assign(new Printer(), { ...settings });
  }

  get dto() {
    return <PrintData>{
      name: this.name,
      location: this.location,
      description: this.description,
      model: this.model,
      driver: this.driver,
      status: this.status,
    };
  }
}
