import * as React from "react"
import {
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

export interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
}

/**
 * We default to `null` so that React.useContext()
 * returns `null` when nobody has provided it,
 * allowing us to guard at runtime.
 */
export const FormFieldContext = React.createContext<
  FormFieldContextValue | null
>(null)

export interface FormItemContextValue {
  id: string
}

export const FormItemContext = React.createContext<
  FormItemContextValue | null
>(null)

/**
 * Hook to pull the current field + item IDs out of context,
 * and wire them up to react-hook-form’s `getFieldState`.
 */
export function useFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>() {
  // these can be null if you forgot to wrap
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext  = React.useContext(FormItemContext)

  if (fieldContext === null) {
    throw new Error("useFormField must be used within a <FormField> provider")
  }
  if (itemContext === null) {
    throw new Error("useFormField must be used within a <FormItem> provider")
  }

  const { getFieldState, formState } = useFormContext<TFieldValues>()
  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name:              fieldContext.name,
    formItemId:        `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId:     `${id}-form-item-message`,
    ...fieldState,
  }
}
