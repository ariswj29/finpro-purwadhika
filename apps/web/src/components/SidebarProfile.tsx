import { menuProfiles } from '@/data/data';

export default function SidebarProfile() {
  return (
    <div className="p-12 sm:p-16 bg-secondary border border-secondary shadow-sm w-full">
      <h3 className="text-2xl font-bold ">Profile Page</h3>
      <ul className="mt-4">
        {menuProfiles.map((item) => (
          <li key={item.id} className="flex items-center justify-between my-2">
            <a href={item.link} className="text-md hover:font-bold">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
