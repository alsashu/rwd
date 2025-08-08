import { IServicesService } from "../services/iservices.service";

export class AppService {
  constructor(public servicesService: IServicesService) {}
}
