using AutoMapper;
using CarSalesCrm.Application.Customers.Dtos;
using CarSalesCrm.Application.Opportunities.Dtos;
using CarSalesCrm.Application.Vehicles.Dtos;
using CarSalesCrm.Domain.Entities;

namespace CarSalesCrm.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateVehicleRequest, Vehicle>();
        CreateMap<UpdateVehicleRequest, Vehicle>();
        CreateMap<Vehicle, VehicleResponse>();
        CreateMap<Vehicle, VehicleDetailsResponse>()
            .ForMember(d => d.OpportunitiesCount, opt => opt.MapFrom(s => s.Opportunities.Count));

        CreateMap<CreateCustomerRequest, Customer>();
        CreateMap<UpdateCustomerRequest, Customer>();
        CreateMap<Customer, CustomerResponse>()
            .ForMember(d => d.HasQuickOpportunity, opt => opt.Ignore())
            .ForMember(d => d.QuickOpportunityVehicleId, opt => opt.Ignore());

        CreateMap<CreateOpportunityRequest, Opportunity>();
        CreateMap<UpdateOpportunityRequest, Opportunity>();
        CreateMap<Opportunity, OpportunityResponse>()
            .ForMember(d => d.CustomerName, opt => opt.MapFrom(s => s.Customer.Name))
            .ForMember(d => d.VehicleBrand, opt => opt.MapFrom(s => s.Vehicle.Brand))
            .ForMember(d => d.VehicleModel, opt => opt.MapFrom(s => s.Vehicle.Model));
        CreateMap<Opportunity, OpportunityDetailsResponse>()
            .ForMember(d => d.CustomerName, opt => opt.MapFrom(s => s.Customer.Name))
            .ForMember(d => d.CustomerEmail, opt => opt.MapFrom(s => s.Customer.Email))
            .ForMember(d => d.CustomerPhone, opt => opt.MapFrom(s => s.Customer.Phone))
            .ForMember(d => d.VehicleBrand, opt => opt.MapFrom(s => s.Vehicle.Brand))
            .ForMember(d => d.VehicleModel, opt => opt.MapFrom(s => s.Vehicle.Model))
            .ForMember(d => d.VehicleYear, opt => opt.MapFrom(s => s.Vehicle.Year))
            .ForMember(d => d.VehiclePrice, opt => opt.MapFrom(s => s.Vehicle.Price));
    }
}
