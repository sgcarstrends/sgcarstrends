import { Chip } from "@heroui/chip";

export function BetaChip() {
  return (
    <Chip color="warning" size="sm" variant="bordered">
      Beta
    </Chip>
  );
}

export function NewChip() {
  return (
    <Chip color="primary" size="sm" variant="flat">
      New
    </Chip>
  );
}
