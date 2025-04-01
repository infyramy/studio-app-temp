<script setup lang="ts">
definePageMeta({
  layout: "empty",
});

const sections = [
  {
    title: "Interpretation",
    content: "The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural."
  },
  {
    title: "Definitions",
    content: [
      "Company (referred to as either \"the Company\", \"We\", \"Us\" or \"Our\" in this Agreement) refers to sole propietor, 1-47, Pusat Perniagaan Perdana Jaya, 14000 Bukit Mertajam.",
      "Goods refer to the items offered for sale on the Service.",
      "Orders mean a request by You to purchase Goods from Us.",
      "Service refers to the Website.",
      "Website refers to STUDIO RAYA PENANG, accessible from perlis.fotoraya.com",
      "You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
    ]
  },
  {
    title: "Your Order Cancellation Rights",
    content: [
      "You are entitled to cancel Your Order within 14 days without giving any reason for doing so.",
      "The deadline for cancelling an Order is 14 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.",
      "In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:",
      "By phone number: 011-62667017",
      "We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement."
    ]
  },
  {
    title: "Conditions for Returns",
    content: [
      "In order for the Goods to be eligible for a return, please make sure that:",
      "• The Goods were purchased in the last 14 days",
      "• The Goods are in the original packaging",
      "\nThe following Goods cannot be returned:",
      "• The supply of Goods made to Your specifications or clearly personalized.",
      "• The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.",
      "• The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.",
      "• The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.",
      "\nWe reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion.",
      "Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law."
    ]
  },
  {
    title: "Returning Goods",
    content: [
      "You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:",
      "1-47, Pusat Perniagaan Perdana Jaya, 14000 Bukit Mertajam",
      "We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery."
    ]
  },
  {
    title: "Gifts",
    content: [
      "If the Goods were marked as a gift when purchased and then shipped directly to you, You'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to You.",
      "If the Goods weren't marked as a gift when purchased, or the gift giver had the Order shipped to themselves to give it to You later, We will send the refund to the gift giver."
    ]
  }
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <!-- Back Button -->
      <div class="mb-8">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </NuxtLink>
      </div>

      <div class="bg-white shadow-sm rounded-lg p-6 sm:p-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Return and Refund Policy</h1>
          <p class="text-gray-600">Last updated: February 26, 2025</p>
        </div>

        <!-- Introduction -->
        <div class="prose prose-slate max-w-none mb-12">
          <p class="text-gray-700">
            Thank you for shopping at <span class="font-semibold">STUDIO RAYA PENANG</span>.
          </p>
          <p class="text-gray-700">
            If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns. 
            This Return and Refund Policy has been created with the help of the Return and Refund Policy Generator.
          </p>
          <p class="text-gray-700">
            The following terms are applicable for any products that You purchased with Us.
          </p>
        </div>

        <!-- Policy Sections -->
        <div class="space-y-12">
          <template v-for="(section, index) in sections" :key="index">
            <section class="border-b border-gray-200 pb-8 last:border-0">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">{{ section.title }}</h2>
              <div class="prose prose-slate max-w-none">
                <template v-if="Array.isArray(section.content)">
                  <p v-for="(paragraph, pIndex) in section.content" 
                     :key="pIndex"
                     class="text-gray-700 whitespace-pre-line mb-3">
                    {{ paragraph }}
                  </p>
                </template>
                <p v-else class="text-gray-700">{{ section.content }}</p>
              </div>
            </section>
          </template>
        </div>

        <!-- Contact Section -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p class="text-gray-700">
            If you have any questions about our Returns and Refunds Policy, please contact us:
          </p>
          <p class="text-gray-700 mt-2">
            By phone number: <a href="tel:011-62667017" class="text-blue-600 hover:text-blue-800">011-62667017</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
