import { useState } from "react";

export default function SizeTex() {
  const [more, setMore] = useState(false);
  return (
    <>
      <div>
        <p>
          Kylian Mbappé Lottin (born 20 December 1998) is a French professional
          footballer who plays as a forward for La Liga club Real Madrid and
          captains the France national team.[2] Widely{" "}
          {!more ? (
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setMore(!more)}
            >
              see More...
            </span>
          ) : (
            ""
          )}
          <span>
            {more
              ? "regarded as one of the best players in the world, he is known for his dribbling, speed, and finishing.[3][4][5]"
              : ""}
          </span>
        </p>
      </div>
    </>
  );
}
