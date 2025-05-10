import React, { useState } from 'react';
import Paginations from '../components/Pagination';
export default function Onboarding() {
  const [page, setPage] = useState(1);

  return (
    <div className="p-4">
      <h1 className="head1">온보딩</h1>
      {<Paginations page={page} setPage={setPage} totalPages={5} />}
    </div>
  );
}
