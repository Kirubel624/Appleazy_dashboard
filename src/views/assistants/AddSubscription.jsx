import { Segmented } from "antd";
import React, { useEffect, useState } from "react";
import PricingCard from "../../components/common/PricingCard";
import api from "../../utils/api";
import CheckOutPage from "./CheckOutPage";
import { ScaleLoader } from "react-spinners";
const AddSubscription = ({
  collapsed,
  setCollapsed,
  current,
  setCurrent,
  next,
  previous,
  setSelectedSubscription,
}) => {
  const [alignValue, setAlignValue] = useState("Per Application");
  const [subscriptionPricings, setSubscriptionPricings] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPricings = async () => {
    setLoading(true);
    const res = await api.get("/subscription-pricing");
    console.log(res, "res of fetch");
    setSubscriptionPricings(res?.data?.data);
    setLoading(false);
  };
  useEffect(() => {
    console.log("after fetching.....");
    fetchPricings();
  }, []);

  return (
    <div>
      {!loading ||
      subscriptionPricings?.fixedPlans?.length > 0 ||
      subscriptionPricings?.variablePlans?.length > 0 ? (
        <>
          <div className=" px-4 pb-24 pt-8">
            <div className="flex flex-col mb-12 items-center justify-center">
              <h1 className="text-4xl font-bold font-organetto mb-4 text-center">
                Post a job
              </h1>
              <Segmented
                defaultValue="center"
                style={{
                  marginBottom: 8,
                  backgroundColor: "#dadada",
                }}
                className="   mb-2"
                value={alignValue}
                onChange={(value) => setAlignValue(value)}
                options={["Per Application", "Fixed"]}
              />
            </div>
            {alignValue === "Fixed" ? (
              <div className="flex flex-wrap items-center justify-center gap-6 ">
                {subscriptionPricings?.fixedPlans?.length > 0 && (
                  <>
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.fixedPlans[0]?.id}
                      description={
                        subscriptionPricings?.fixedPlans[0]?.features
                      }
                      tier={subscriptionPricings?.fixedPlans[0]?.tier}
                      type="monthly"
                      jobLimit={subscriptionPricings?.fixedPlans[0]?.jobLimit}
                      amount={subscriptionPricings?.fixedPlans[0]?.amount}
                      recommended={
                        subscriptionPricings?.fixedPlans[0]?.recommended
                      }
                      isFixed={subscriptionPricings?.fixedPlans[0]?.isFixed}
                      subInfo={subscriptionPricings?.fixedPlans[0]}
                    />
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.fixedPlans[1]?.id}
                      description={
                        subscriptionPricings?.fixedPlans[1]?.features
                      }
                      tier={subscriptionPricings?.fixedPlans[1]?.tier}
                      type="monthly"
                      jobLimit={subscriptionPricings?.fixedPlans[1]?.jobLimit}
                      amount={subscriptionPricings?.fixedPlans[1]?.amount}
                      recommended={
                        subscriptionPricings?.fixedPlans[1]?.recommended
                      }
                      isFixed={subscriptionPricings?.fixedPlans[1]?.isFixed}
                      subInfo={subscriptionPricings?.fixedPlans[1]}
                    />
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.fixedPlans[2]?.id}
                      description={
                        subscriptionPricings?.fixedPlans[2]?.features
                      }
                      tier={subscriptionPricings?.fixedPlans[2]?.tier}
                      type="monthly"
                      jobLimit={subscriptionPricings?.fixedPlans[2]?.jobLimit}
                      amount={subscriptionPricings?.fixedPlans[2]?.amount}
                      recommended={
                        subscriptionPricings?.fixedPlans[2]?.recommended
                      }
                      isFixed={subscriptionPricings?.fixedPlans[2]?.isFixed}
                      subInfo={subscriptionPricings?.fixedPlans[2]}
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-6 ">
                {subscriptionPricings?.variablePlans?.length > 0 && (
                  <>
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.variablePlans[0]?.id}
                      description={
                        subscriptionPricings?.variablePlans[0]?.features
                      }
                      tier={subscriptionPricings?.variablePlans[0]?.tier}
                      jobLimit={
                        subscriptionPricings?.variablePlans[0]?.jobLimit
                      }
                      type="Per application"
                      recommended={
                        subscriptionPricings?.variablePlans[0]?.recommended
                      }
                      amount={subscriptionPricings?.variablePlans[0]?.amount}
                      isFixed={subscriptionPricings?.variablePlans[0]?.isFixed}
                      subInfo={subscriptionPricings?.variablePlans[0]}
                    />
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.variablePlans[1]?.id}
                      description={
                        subscriptionPricings?.variablePlans[1]?.features
                      }
                      tier={subscriptionPricings?.variablePlans[1]?.tier}
                      jobLimit={
                        subscriptionPricings?.variablePlans[1]?.jobLimit
                      }
                      type="Per application"
                      amount={subscriptionPricings?.variablePlans[1]?.amount}
                      recommended={
                        subscriptionPricings?.variablePlans[1]?.recommended
                      }
                      isFixed={subscriptionPricings?.variablePlans[1]?.isFixed}
                      subInfo={subscriptionPricings?.variablePlans[1]}
                    />
                    <PricingCard
                      setSelectedSubscription={setSelectedSubscription}
                      current={current}
                      setCurrent={setCurrent}
                      next={next}
                      previous={previous}
                      id={subscriptionPricings?.variablePlans[2]?.id}
                      description={
                        subscriptionPricings?.variablePlans[2]?.features
                      }
                      tier={subscriptionPricings?.variablePlans[2]?.tier}
                      jobLimit={
                        subscriptionPricings?.variablePlans[2]?.jobLimit
                      }
                      type="Per application"
                      amount={subscriptionPricings?.variablePlans[2]?.amount}
                      recommended={
                        subscriptionPricings?.variablePlans[2]?.recommended
                      }
                      isFixed={subscriptionPricings?.variablePlans[2]?.isFixed}
                      subInfo={subscriptionPricings?.variablePlans[2]}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="borde flex items-center justify-center h-screen border-red-900">
          <ScaleLoader
            color="#168A53"
            loading={loading}
            //  cssOverride={override}
            className=" rounded-full"
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
};

export default AddSubscription;
