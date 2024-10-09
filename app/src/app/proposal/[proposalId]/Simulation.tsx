import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Simulation = ({ proposalId }: { proposalId: string }) => {
  const [loading, setLoading] = useState(false);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSimulation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulate?id=${proposalId}`);
      const data = await response.json();
      if (data.simulations) setSimulations(data.simulations);
      else setError(data.message);
    } catch (error) {
      setError(`${error}`);
      console.error("Error occurred during simulation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="simulate-button"
        onClick={handleSimulation}
        disabled={loading}
      >
        {loading ? "Loading..." : "Simulate Steps"}
      </button>
      {error && <p>{error}</p>}
      {simulations?.length > 0 && (
        <ul>
          {simulations.map((simulation, index) => (
            <li key={index} className="call-data-link">
              {index + 1}. {simulation.simulation.status ? "✅" : "❌"}{" "}
              <Link
                href={simulation.url}
                target="_blank"
                className="call-data-link"
              >
                {simulation.simulation.method || "(unknown)"}{" "}
                <Image
                  src={"/external-link.svg"}
                  alt="link"
                  width={20}
                  height={20}
                ></Image>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Simulation;
