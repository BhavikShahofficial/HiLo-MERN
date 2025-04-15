"use client";

import { useState } from "react";
import { filterOptions } from "@/config";
import { Label } from "@radix-ui/react-label";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react"; // icon for the filter button

function ProductFilter({ filter, handleFilter }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-0">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {Object.keys(filterOptions).map((keyItem, index, array) => (
                <Fragment key={keyItem}>
                  <div>
                    <h3 className="text-base font-semibold">
                      {keyItem.toUpperCase()}
                    </h3>
                    <div className="grid gap-2 mt-2 grid-cols-1">
                      {filterOptions[keyItem].map((option) => (
                        <Label
                          className="flex font-medium items-center gap-2"
                          key={option.id}
                        >
                          <Checkbox
                            checked={
                              filter?.[keyItem]?.includes(option.id) ?? false
                            }
                            onCheckedChange={() =>
                              handleFilter(keyItem, option.id)
                            }
                            aria-label={`${keyItem}-${option.label}`}
                          />
                          {option.label}
                        </Label>
                      ))}
                    </div>
                  </div>
                  {index < array.length - 1 && <Separator />}
                </Fragment>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-background rounded-lg shadow-sm w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        <div className="p-4 space-y-4">
          {Object.keys(filterOptions).map((keyItem, index, array) => (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-semibold">
                  {keyItem.toUpperCase()}
                </h3>
                <div className="grid gap-2 mt-2 grid-cols-1">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      className="flex font-medium items-center gap-2"
                      key={option.id}
                    >
                      <Checkbox
                        checked={
                          filter?.[keyItem]?.includes(option.id) ?? false
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                        aria-label={`${keyItem}-${option.label}`}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              {index < array.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductFilter;
