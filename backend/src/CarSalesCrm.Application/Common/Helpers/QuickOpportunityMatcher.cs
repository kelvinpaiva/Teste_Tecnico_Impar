using CarSalesCrm.Domain.Entities;
using CarSalesCrm.Domain.Enums;

namespace CarSalesCrm.Application.Common.Helpers;

public static class QuickOpportunityMatcher
{
    /// <summary>
    /// Retorna o primeiro veículo Disponivel que atende o interesse do cliente.
    /// CarroZero: KM == 0; CarroUsado: KM &gt; 0; demais interesses: Tipo do veículo deve coincidir.
    /// </summary>
    public static Guid? FindMatchingVehicleId(CustomerInterest interest, IEnumerable<Vehicle> availableVehicles)
    {
        var match = availableVehicles.FirstOrDefault(v => Matches(interest, v));
        return match?.Id;
    }

    public static bool Matches(CustomerInterest interest, Vehicle vehicle)
    {
        if (vehicle.Status != VehicleStatus.Disponivel)
            return false;

        return interest switch
        {
            CustomerInterest.CarroZero => vehicle.Mileage == 0,
            CustomerInterest.CarroUsado => vehicle.Mileage > 0,
            CustomerInterest.SUV => vehicle.Type == VehicleType.SUV,
            CustomerInterest.Hatch => vehicle.Type == VehicleType.Hatch,
            CustomerInterest.Sedan => vehicle.Type == VehicleType.Sedan,
            CustomerInterest.Utilitario => vehicle.Type == VehicleType.Utilitario,
            _ => false
        };
    }
}
