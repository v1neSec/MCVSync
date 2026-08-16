import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/LoadingButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategoriesQuery, useUnitsQuery } from "@/hooks/useInventory";
import { getErrorMessage, getFieldErrors } from "@/lib/errors";
import type { ItemPayload } from "@/api/inventory";
import type { Item } from "@/types/inventory";

interface ItemFormProps {
  initialItem?: Item;
  onSubmit: (payload: ItemPayload) => void;
  isPending: boolean;
  submitError?: unknown;
}

export function ItemForm({ initialItem, onSubmit, isPending, submitError }: ItemFormProps) {
  const categoriesQuery = useCategoriesQuery();
  const unitsQuery = useUnitsQuery();
  const fieldErrors = getFieldErrors(submitError);

  const [name, setName] = useState(initialItem?.name ?? "");
  const [sku, setSku] = useState(initialItem?.sku ?? "");
  const [barcode, setBarcode] = useState(initialItem?.barcode ?? "");
  const [categoryId, setCategoryId] = useState(
    initialItem?.category ? String(initialItem.category.id) : "",
  );
  const [unitId, setUnitId] = useState(initialItem?.unit ? String(initialItem.unit.id) : "");
  const [description, setDescription] = useState(initialItem?.description ?? "");
  const [hasExpiry, setHasExpiry] = useState(initialItem?.has_expiry ?? true);
  const [thresholdDays, setThresholdDays] = useState(
    initialItem?.expiry_alert_threshold_days != null
      ? String(initialItem.expiry_alert_threshold_days)
      : "",
  );
  const [reorderPoint, setReorderPoint] = useState(
    initialItem?.reorder_point != null ? String(initialItem.reorder_point) : "",
  );
  const [reorderQuantity, setReorderQuantity] = useState(
    initialItem?.reorder_quantity != null ? String(initialItem.reorder_quantity) : "",
  );
  const [isActive, setIsActive] = useState(initialItem?.is_active ?? true);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    onSubmit({
      name,
      sku,
      barcode: barcode.trim() || null,
      category_id: Number(categoryId),
      unit_id: Number(unitId),
      description: description.trim() || null,
      has_expiry: hasExpiry,
      expiry_alert_threshold_days: thresholdDays === "" ? null : Number(thresholdDays),
      reorder_point: reorderPoint === "" ? null : Number(reorderPoint),
      reorder_quantity: reorderQuantity === "" ? null : Number(reorderQuantity),
      is_active: isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!!submitError && !Object.keys(fieldErrors).length && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{getErrorMessage(submitError)}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-name">Name</Label>
          <Input
            id="item-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-sku">SKU</Label>
          <Input
            id="item-sku"
            required
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            aria-invalid={!!fieldErrors.sku}
          />
          {fieldErrors.sku && <p className="text-xs text-destructive">{fieldErrors.sku}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-barcode">Barcode (optional)</Label>
          <Input
            id="item-barcode"
            value={barcode ?? ""}
            onChange={(event) => setBarcode(event.target.value)}
            aria-invalid={!!fieldErrors.barcode}
          />
          {fieldErrors.barcode && (
            <p className="text-xs text-destructive">{fieldErrors.barcode}</p>
          )}
        </div>

        <div />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="item-category">Category</Label>
            <Link
              to="/items/categories"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Manage categories
            </Link>
          </div>
          <Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? "")}>
            <SelectTrigger id="item-category" aria-invalid={!!fieldErrors.category_id}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesQuery.data?.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.category_id && (
            <p className="text-xs text-destructive">{fieldErrors.category_id}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="item-unit">Unit</Label>
            <Link
              to="/items/units"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Manage units
            </Link>
          </div>
          <Select value={unitId} onValueChange={(value) => setUnitId(value ?? "")}>
            <SelectTrigger id="item-unit" aria-invalid={!!fieldErrors.unit_id}>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {unitsQuery.data?.map((unit) => (
                <SelectItem key={unit.id} value={String(unit.id)}>
                  {unit.name} ({unit.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.unit_id && (
            <p className="text-xs text-destructive">{fieldErrors.unit_id}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="item-description">Description (optional)</Label>
        <Textarea
          id="item-description"
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between border border-border p-3">
        <div>
          <Label htmlFor="item-has-expiry">Has expiry</Label>
          <p className="text-xs text-muted-foreground">
            Off for durable items like equipment — their batches won't track an expiry date.
          </p>
        </div>
        <Switch id="item-has-expiry" checked={hasExpiry} onCheckedChange={setHasExpiry} />
      </div>

      {hasExpiry && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-threshold">Expiry alert threshold (days, optional)</Label>
          <Input
            id="item-threshold"
            type="number"
            min={0}
            placeholder="Falls back to the system default if left blank"
            value={thresholdDays}
            onChange={(event) => setThresholdDays(event.target.value)}
            aria-invalid={!!fieldErrors.expiry_alert_threshold_days}
          />
          {fieldErrors.expiry_alert_threshold_days && (
            <p className="text-xs text-destructive">{fieldErrors.expiry_alert_threshold_days}</p>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-reorder-point">Reorder point (optional)</Label>
          <Input
            id="item-reorder-point"
            type="number"
            min={0}
            value={reorderPoint}
            onChange={(event) => setReorderPoint(event.target.value)}
            aria-invalid={!!fieldErrors.reorder_point}
          />
          {fieldErrors.reorder_point && (
            <p className="text-xs text-destructive">{fieldErrors.reorder_point}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="item-reorder-quantity">Reorder quantity (optional)</Label>
          <Input
            id="item-reorder-quantity"
            type="number"
            min={0}
            value={reorderQuantity}
            onChange={(event) => setReorderQuantity(event.target.value)}
            aria-invalid={!!fieldErrors.reorder_quantity}
          />
          {fieldErrors.reorder_quantity && (
            <p className="text-xs text-destructive">{fieldErrors.reorder_quantity}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border border-border p-3">
        <Label htmlFor="item-active">Active</Label>
        <Switch id="item-active" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <div className="flex justify-end gap-2">
        <LoadingButton type="submit" isPending={isPending} pendingText="Saving...">
          {initialItem ? "Save Changes" : "Create Item"}
        </LoadingButton>
      </div>
    </form>
  );
}
