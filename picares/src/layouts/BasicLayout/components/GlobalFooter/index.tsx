import "./index.css";

export const GlobalFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div id="globalFooter">
      <div>@ {year} Picares</div>
    </div>
  );
};
