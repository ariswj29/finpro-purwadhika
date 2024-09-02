import { useState } from 'react';

export default function SelectOption({
  label,
  options,
}: {
  label: string;
  options: any[];
}) {
  return (
    <div className="md:grid gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <select className="select select-bordered">
          <option disabled selected>
            Pick one
          </option>
          {options?.map((option) => (
            <option key={option.id}>
              {option.name} {option?.address && `| ${option?.address}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
