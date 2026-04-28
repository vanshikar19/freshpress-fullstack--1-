import { useState, useMemo } from "react";
import { useOrders } from "../context/OrdersContext";

export function useOrderFilter() {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [garmentFilter, setGarmentFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");

  const filtered = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((o) => {
      try {
        const q = search.toLowerCase().trim();

        const orderId = (o.orderId || o.id || "").toLowerCase();
        const custName = (o.customerName || "").toLowerCase();
        const phone = o.phone || "";

        const matchSearch =
          !q ||
          custName.includes(q) ||
          phone.includes(q) ||
          orderId.includes(q);

        const matchStatus = !statusFilter || o.status === statusFilter;

        const matchGarment =
          !garmentFilter ||
          (Array.isArray(o.garments) &&
            o.garments.some((g) =>
              (g.item || "")
                .toLowerCase()
                .includes(garmentFilter.toLowerCase()),
            ));

        const matchDelivery =
          !deliveryFilter ||
          (o.estimatedDelivery && o.estimatedDelivery === deliveryFilter);

        return matchSearch && matchStatus && matchGarment && matchDelivery;
      } catch {
        return true;
      }
    });
  }, [orders, search, statusFilter, garmentFilter, deliveryFilter]);

  const clearAll = () => {
    setSearch("");
    setStatusFilter("");
    setGarmentFilter("");
    setDeliveryFilter("");
  };

  return {
    filtered,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    garmentFilter,
    setGarmentFilter,
    deliveryFilter,
    setDeliveryFilter,
    clearAll,
    hasFilters: !!(search || statusFilter || garmentFilter || deliveryFilter),
  };
}
