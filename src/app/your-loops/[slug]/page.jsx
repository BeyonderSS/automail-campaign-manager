import React from "react";

async function page({ params }) {
  const { slug } = await params;
  return <div>Individual loop data Slug - {slug} </div>;
}

export default page;
