

export const FieldInfo = ({ fieldMeta }) => {
  if (!fieldMeta) return null
  return (
    <>
      {fieldMeta.isTouched && fieldMeta.errors.length ? (
        <p className="text-red-500 text-sm mt-1">
          {fieldMeta.errors.join(", ")}
        </p>
      ) : null}
    </>
  )
}
