"use client";

import {
  Accordion,
  Alert,
  Avatar,
  Button,
  Card,
  Chip,
  ComboBox,
  Drawer,
  Input,
  InputGroup,
  Label,
  Link,
  ListBox,
  Popover,
  ProgressBar,
  Select,
  Separator,
  Skeleton,
  Tabs,
  Tooltip,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useState } from "react";

// === DATA ===
const typographyScale = [
  { name: "H1", class: "text-4xl font-semibold", size: "36px" },
  { name: "H2", class: "text-3xl font-semibold", size: "30px" },
  { name: "H3", class: "text-2xl font-medium", size: "24px" },
  { name: "H4", class: "text-xl font-medium", size: "20px" },
  { name: "Body", class: "text-base", size: "16px" },
  { name: "Small", class: "text-sm", size: "14px" },
  { name: "XSmall", class: "text-xs", size: "12px" },
];

const spacingScale = [
  { name: "gap-2", value: "8px", width: 32 },
  { name: "gap-4", value: "16px", width: 64 },
  { name: "gap-6", value: "24px", width: 96 },
  { name: "gap-8", value: "32px", width: 128 },
  { name: "gap-12", value: "48px", width: 192 },
];

const brandColors = [
  {
    name: "Primary",
    token: "primary",
    hex: "#191970",
    usage: "Headers, buttons, key accents",
  },
  {
    name: "Secondary",
    token: "secondary",
    hex: "#708090",
    usage: "Cards, borders, secondary buttons",
  },
  {
    name: "Success",
    token: "success",
    hex: "#22C55E",
    usage: "Positive trends, gains",
  },
  {
    name: "Warning",
    token: "warning",
    hex: "#F59E0B",
    usage: "Caution, alerts",
  },
  { name: "Danger", token: "danger", hex: "#DC2626", usage: "Errors, losses" },
];

const chartColors = [
  {
    name: "Chart 1",
    variable: "--chart-1",
    description: "Primary/top ranking",
  },
  { name: "Chart 2", variable: "--chart-2", description: "Second ranking" },
  { name: "Chart 3", variable: "--chart-3", description: "Third ranking" },
  { name: "Chart 4", variable: "--chart-4", description: "Fourth ranking" },
  { name: "Chart 5", variable: "--chart-5", description: "Fifth ranking" },
  { name: "Chart 6", variable: "--chart-6", description: "Sixth ranking" },
];

const defaultScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const carMakes = [
  { key: "toyota", label: "Toyota" },
  { key: "honda", label: "Honda" },
  { key: "bmw", label: "BMW" },
  { key: "mercedes", label: "Mercedes-Benz" },
  { key: "audi", label: "Audi" },
];

const coeCategories = [
  { key: "A", label: "Category A - Cars up to 1600cc" },
  { key: "B", label: "Category B - Cars above 1600cc" },
  { key: "C", label: "Category C - Goods Vehicles" },
  { key: "D", label: "Category D - Motorcycles" },
  { key: "E", label: "Category E - Open Category" },
];

export default function ComponentsPreviewPage() {
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const drawerState = useOverlayState();

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl text-foreground">Design System</h1>
        <p className="text-default-600">
          Navy Blue theme and HeroUI v3 components - design token driven preview
        </p>
      </div>

      {/* Tabbed Navigation */}
      <Tabs defaultSelectedKey="colors">
        <Tabs.ListContainer className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
          <Tabs.List>
            <Tabs.Tab id="colors">Colors</Tabs.Tab>
            <Tabs.Tab id="typography">Typography</Tabs.Tab>
            <Tabs.Tab id="spacing">Spacing</Tabs.Tab>
            <Tabs.Tab id="components">Components</Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        {/* === COLORS TAB === */}
        <Tabs.Panel id="colors">
          <div className="flex flex-col gap-6 pt-4">
            <h2 className="font-semibold text-2xl">Colors</h2>

            {/* Brand Colors */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Brand Colors</p>
                  <p className="text-default-500 text-sm">
                    Semantic colors from theme configuration
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-6">
                  {brandColors.map((color) => (
                    <div key={color.name} className="flex items-center gap-3">
                      <div className={`size-12 rounded-lg bg-${color.token}`} />
                      <div>
                        <p className="font-medium text-sm">{color.name}</p>
                        <p className="text-default-500 text-xs">{color.hex}</p>
                        <p className="text-default-400 text-xs">
                          {color.usage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Chart Colors */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Chart Colors</p>
                  <p className="text-default-500 text-sm">
                    Navy Blue gradient for data visualization
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-4">
                  {chartColors.map((color, _index) => (
                    <div key={color.name} className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-lg"
                        style={{ backgroundColor: `var(${color.variable})` }}
                      />
                      <div>
                        <p className="font-medium text-sm">{color.name}</p>
                        <code className="text-default-500 text-xs">
                          {color.variable}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Default Scale */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Default Scale</p>
                  <p className="text-default-500 text-sm">
                    Neutral color scale for UI elements
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  {defaultScale.map((shade) => (
                    <div
                      key={shade}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className={`size-10 rounded-lg bg-default-${shade}`}
                      />
                      <code className="text-default-500 text-xs">{shade}</code>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>

        {/* === TYPOGRAPHY TAB === */}
        <Tabs.Panel id="typography">
          <div className="flex flex-col gap-6 pt-4">
            <h2 className="font-semibold text-2xl">Typography</h2>

            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Type Scale</p>
                  <p className="text-default-500 text-sm">Font: Geist Sans</p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {typographyScale.map((type) => (
                  <div key={type.name} className="flex items-center gap-4">
                    <code className="w-16 rounded bg-default-100 px-2 py-1 text-center text-xs">
                      {type.name}
                    </code>
                    <span className={type.class}>The quick brown fox</span>
                    <span className="text-default-400 text-xs">
                      {type.size}
                    </span>
                  </div>
                ))}
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>

        {/* === SPACING TAB === */}
        <Tabs.Panel id="spacing">
          <div className="flex flex-col gap-6 pt-4">
            <h2 className="font-semibold text-2xl">Spacing</h2>

            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Spacing Scale</p>
                  <p className="text-default-500 text-sm">
                    Use gap utilities with even numbers
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {/* Rules */}
                <Alert status="accent">
                  <div className="flex flex-col gap-1 text-sm">
                    <p>
                      ✓ Use <code>gap-*</code> with even numbers
                    </p>
                    <p>
                      ✗ Avoid <code>space-y-*</code>
                    </p>
                    <p>
                      ✗ Never use <code>margin-top</code>
                    </p>
                  </div>
                </Alert>

                {/* Scale visualization */}
                <div className="flex flex-col gap-4">
                  {spacingScale.map((space) => (
                    <div key={space.name} className="flex items-center gap-4">
                      <code className="w-20 rounded bg-default-100 px-2 py-1 text-center text-xs">
                        {space.name}
                      </code>
                      <div
                        className="h-4 rounded bg-primary"
                        style={{ width: space.width }}
                      />
                      <span className="text-default-400 text-xs">
                        {space.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>

        {/* === COMPONENTS TAB === */}
        <Tabs.Panel id="components">
          <div className="flex flex-col gap-8 pt-4">
            <h2 className="font-semibold text-2xl">Components</h2>

            {/* Buttons */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Buttons</p>
                  <p className="text-default-500 text-sm">
                    Colors, variants, and sizes
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-6">
                {/* Variants */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Variants</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="tertiary">Tertiary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="danger-soft">Danger Soft</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Sizes</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="primary" size="sm">
                      Small
                    </Button>
                    <Button variant="primary" size="md">
                      Medium
                    </Button>
                    <Button variant="primary" size="lg">
                      Large
                    </Button>
                  </div>
                </div>

                {/* States */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">States</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary" isDisabled>
                      Disabled
                    </Button>
                    <Button variant="primary" isPending>
                      Loading
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Chips */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Chips</p>
                  <p className="text-default-500 text-sm">
                    Status indicators and labels
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {/* Colors */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    <Chip color="default">Default</Chip>
                    <Chip color="accent">Accent</Chip>
                    <Chip color="success">+5.2%</Chip>
                    <Chip color="warning">Warning</Chip>
                    <Chip color="danger">-2.1%</Chip>
                  </div>
                </div>

                {/* Variants */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Variants</p>
                  <div className="flex flex-wrap gap-2">
                    <Chip variant="primary">Primary</Chip>
                    <Chip variant="secondary">Secondary</Chip>
                    <Chip variant="soft">Soft</Chip>
                    <Chip variant="tertiary">Tertiary</Chip>
                  </div>
                </div>

                {/* Sizes */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Sizes</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip color="accent" size="sm">
                      Small
                    </Chip>
                    <Chip color="accent" size="md">
                      Medium
                    </Chip>
                    <Chip color="accent" size="lg">
                      Large
                    </Chip>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Avatars */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Avatars</p>
                  <p className="text-default-500 text-sm">
                    User profile images with fallback
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {/* Sizes */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Sizes</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar size="sm">
                      <Avatar.Fallback>SM</Avatar.Fallback>
                    </Avatar>
                    <Avatar size="md">
                      <Avatar.Fallback>MD</Avatar.Fallback>
                    </Avatar>
                    <Avatar size="lg">
                      <Avatar.Fallback>LG</Avatar.Fallback>
                    </Avatar>
                  </div>
                </div>

                {/* Colors */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Colors</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar>
                      <Avatar.Fallback>DF</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="bg-accent">
                      <Avatar.Fallback>PR</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="bg-secondary">
                      <Avatar.Fallback>SE</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="bg-success">
                      <Avatar.Fallback>SU</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="bg-warning">
                      <Avatar.Fallback>WA</Avatar.Fallback>
                    </Avatar>
                    <Avatar className="bg-danger">
                      <Avatar.Fallback>DA</Avatar.Fallback>
                    </Avatar>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Alerts */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Alerts</p>
                  <p className="text-default-500 text-sm">
                    Status messages and notifications
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <Alert status="default">
                  <Alert.Content>
                    <Alert.Title>Default Alert</Alert.Title>
                    <Alert.Description>
                      This is a neutral informational message.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
                <Alert status="accent">
                  <Alert.Content>
                    <Alert.Title>Primary Alert</Alert.Title>
                    <Alert.Description>
                      Highlighted information for the user.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
                <Alert status="success">
                  <Alert.Content>
                    <Alert.Title>Success</Alert.Title>
                    <Alert.Description>
                      Operation completed successfully.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
                <Alert status="warning">
                  <Alert.Content>
                    <Alert.Title>Warning</Alert.Title>
                    <Alert.Description>
                      Market volatility is higher than usual.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
                <Alert status="danger">
                  <Alert.Content>
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>
                      Failed to fetch data. Please try again.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>
              </Card.Content>
            </Card>

            {/* Form Controls */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Form Controls</p>
                  <p className="text-default-500 text-sm">
                    Input fields, selects, and autocomplete
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-6">
                {/* Input variants */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Input Variants</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label>Primary</Label>
                      <InputGroup variant="primary">
                        <InputGroup.Input
                          placeholder="Enter value"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Secondary</Label>
                      <InputGroup variant="secondary">
                        <InputGroup.Input placeholder="Enter value" />
                      </InputGroup>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Default</Label>
                      <InputGroup>
                        <InputGroup.Input placeholder="Enter value" />
                      </InputGroup>
                    </div>
                  </div>
                </div>

                {/* Select */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Select</p>
                  <Select
                    aria-label="COE Category"
                    selectedKey={selectedMake || null}
                    onSelectionChange={(key) =>
                      setSelectedMake(key ? String(key) : "")
                    }
                  >
                    <Select.Trigger>
                      <Select.Value>
                        {selectedMake
                          ? (coeCategories.find((c) => c.key === selectedMake)
                              ?.label ?? "Select a category")
                          : "Select a category"}
                      </Select.Value>
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {coeCategories.map((cat) => (
                          <ListBox.Item key={cat.key} id={cat.key}>
                            {cat.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                {/* ComboBox */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">ComboBox</p>
                  <ComboBox>
                    <Label className="sr-only">Car Make</Label>
                    <ComboBox.InputGroup>
                      <Input placeholder="Search for a make" />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover>
                      <ListBox>
                        {carMakes.map((make) => (
                          <ListBox.Item key={make.key} textValue={make.label}>
                            {make.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </ComboBox.Popover>
                  </ComboBox>
                </div>
              </Card.Content>
            </Card>

            {/* Progress */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Progress</p>
                  <p className="text-default-500 text-sm">
                    Progress bars and indicators
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {/* Colors */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Colors</p>
                  <div className="flex flex-col gap-3">
                    <ProgressBar color="default" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="accent" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="success" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="warning" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="danger" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                  </div>
                </div>

                {/* Sizes */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Sizes</p>
                  <div className="flex flex-col gap-3">
                    <ProgressBar color="accent" size="sm" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="accent" size="md" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                    <ProgressBar color="accent" size="lg" value={60}>
                      <ProgressBar.Track>
                        <ProgressBar.Fill />
                      </ProgressBar.Track>
                    </ProgressBar>
                  </div>
                </div>

                {/* Indeterminate */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Indeterminate</p>
                  <ProgressBar color="accent" isIndeterminate>
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                </div>
              </Card.Content>
            </Card>

            {/* Skeleton */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Skeleton</p>
                  <p className="text-default-500 text-sm">
                    Loading placeholders
                  </p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
              </Card.Content>
            </Card>

            {/* Links */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Links</p>
                  <p className="text-default-500 text-sm">
                    Navigation and anchor elements
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap items-center gap-6">
                  <Link href="#" className="hover:underline">
                    Hover underline
                  </Link>
                  <Link href="#" className="underline">
                    Always underline
                  </Link>
                  <Link href="#" className="no-underline">
                    No underline
                  </Link>
                  <Link href="#" isDisabled>
                    Disabled
                  </Link>
                  <Link href="#" target="_blank" rel="noopener noreferrer">
                    External link
                  </Link>
                </div>
              </Card.Content>
            </Card>

            {/* Divider */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Divider</p>
                  <p className="text-default-500 text-sm">Visual separators</p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm">Content above</p>
                  <Separator />
                  <p className="text-sm">Content below</p>
                </div>
                <div className="flex h-8 items-center gap-4">
                  <span className="text-sm">Item 1</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">Item 2</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm">Item 3</span>
                </div>
              </Card.Content>
            </Card>

            {/* Tooltip */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Tooltip</p>
                  <p className="text-default-500 text-sm">
                    Helpful hints on hover
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-4">
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Button variant="secondary">Hover me</Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Default tooltip</Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Button variant="secondary">Top</Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content placement="top">
                      Top placement
                    </Tooltip.Content>
                  </Tooltip>
                  <Tooltip>
                    <Tooltip.Trigger>
                      <Button variant="secondary">Bottom</Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content placement="bottom">
                      Bottom placement
                    </Tooltip.Content>
                  </Tooltip>
                </div>
              </Card.Content>
            </Card>

            {/* Popover */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Popover</p>
                  <p className="text-default-500 text-sm">
                    Rich content overlays
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <Popover>
                  <Popover.Trigger>
                    <Button variant="secondary">Open Popover</Button>
                  </Popover.Trigger>
                  <Popover.Content placement="bottom">
                    <div className="flex flex-col gap-2 p-4">
                      <p className="font-medium">COE Details</p>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between gap-8">
                          <span className="text-default-500">Category</span>
                          <span>A</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-default-500">Premium</span>
                          <span>$106,000</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-default-500">Quota</span>
                          <span>1,234</span>
                        </div>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover>
              </Card.Content>
            </Card>

            {/* Drawer */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Drawer</p>
                  <p className="text-default-500 text-sm">Slide-out panels</p>
                </div>
              </Card.Header>
              <Card.Content>
                <Button variant="secondary" onPress={drawerState.open}>
                  Open Drawer
                </Button>
                <Drawer state={drawerState}>
                  <Drawer.Backdrop>
                    <Drawer.Content placement="right">
                      <Drawer.Dialog>
                        <Drawer.Header>Drawer Title</Drawer.Header>
                        <Drawer.Body>
                          <p className="text-default-600">
                            This is a drawer panel that slides in from the side.
                          </p>
                        </Drawer.Body>
                      </Drawer.Dialog>
                    </Drawer.Content>
                  </Drawer.Backdrop>
                </Drawer>
              </Card.Content>
            </Card>

            {/* Accordion */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Accordion</p>
                  <p className="text-default-500 text-sm">
                    Collapsible content sections
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <Accordion>
                  <Accordion.Item id="1">
                    <Accordion.Heading>
                      <Accordion.Trigger>Category A</Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <p className="text-default-600 text-sm">
                        Cars up to 1600cc and 97kW. Most popular category for
                        small cars.
                      </p>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item id="2">
                    <Accordion.Heading>
                      <Accordion.Trigger>Category B</Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <p className="text-default-600 text-sm">
                        Cars above 1600cc or 97kW. For larger vehicles and
                        luxury cars.
                      </p>
                    </Accordion.Panel>
                  </Accordion.Item>
                  <Accordion.Item id="3">
                    <Accordion.Heading>
                      <Accordion.Trigger>Category E</Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <p className="text-default-600 text-sm">
                        Open category - can be used for any vehicle type.
                      </p>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Card.Content>
            </Card>

            {/* Tabs (nested demo) */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Tabs</p>
                  <p className="text-default-500 text-sm">Tab variants</p>
                </div>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                {/* Variants */}
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Primary</p>
                  <Tabs variant="primary">
                    <Tabs.ListContainer>
                      <Tabs.List>
                        <Tabs.Tab id="cars-primary">Cars</Tabs.Tab>
                        <Tabs.Tab id="coe-primary">COE</Tabs.Tab>
                        <Tabs.Tab id="dereg-primary">Deregistrations</Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>
                  </Tabs>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-medium text-sm">Secondary</p>
                  <Tabs variant="secondary">
                    <Tabs.ListContainer>
                      <Tabs.List>
                        <Tabs.Tab id="cars-secondary">Cars</Tabs.Tab>
                        <Tabs.Tab id="coe-secondary">COE</Tabs.Tab>
                        <Tabs.Tab id="dereg-secondary">
                          Deregistrations
                        </Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>
                  </Tabs>
                </div>
              </Card.Content>
            </Card>

            {/* Toast */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Toast</p>
                  <p className="text-default-500 text-sm">
                    Notification messages
                  </p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onPress={() =>
                      toast("Default", {
                        description: "This is a default toast",
                      })
                    }
                  >
                    Default Toast
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() =>
                      toast.success("Success", {
                        description: "Operation completed successfully",
                      })
                    }
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="outline"
                    onPress={() =>
                      toast.warning("Warning", {
                        description: "Please review before proceeding",
                      })
                    }
                  >
                    Warning Toast
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() =>
                      toast.danger("Error", {
                        description: "Something went wrong",
                      })
                    }
                  >
                    Danger Toast
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Card Examples */}
            <Card>
              <Card.Header>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Card Examples</p>
                  <p className="text-default-500 text-sm">Card compositions</p>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Basic Card */}
                  <Card>
                    <Card.Header>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Basic Card</p>
                        <p className="text-default-500 text-sm">Simple card</p>
                      </div>
                    </Card.Header>
                    <Card.Footer>
                      <Button size="sm" variant="primary">
                        Action
                      </Button>
                    </Card.Footer>
                  </Card>

                  {/* Metric Card */}
                  <Card>
                    <Card.Header>
                      <div className="flex flex-col gap-1">
                        <p className="text-default-500 text-sm">COE Premium</p>
                        <p className="font-bold text-2xl">$106,000</p>
                      </div>
                    </Card.Header>
                    <Card.Footer>
                      <Chip color="success" size="sm">
                        +2.5%
                      </Chip>
                    </Card.Footer>
                  </Card>

                  {/* Pressable Card */}
                  <Card>
                    <Card.Header>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">Pressable Card</p>
                        <p className="text-default-500 text-sm">Click me</p>
                      </div>
                    </Card.Header>
                    <Card.Content>
                      <p className="text-default-600 text-sm">
                        This card is interactive
                      </p>
                    </Card.Content>
                  </Card>
                </div>
              </Card.Content>
            </Card>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
