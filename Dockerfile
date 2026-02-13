FROM node:22-alpine

# Prisma va Native modullar (bcrypt kabi) uchun kerakli paketlar
RUN apk add --no-cache openssl libc6-compat make gcc g++ python3

WORKDIR /app

# 1. Dependency-larni o'rnatish
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# 2. Loyiha kodini ko'chirish
COPY . .

# 3. Prisma clientni generatsiya qilish
RUN npx prisma generate

EXPOSE 3030

# 4. TSX orqali to'g'ridan-to'g'ri yurgizamiz. 
# Bu ESM va Extension (.js) muammolarini avtomatik hal qiladi.
CMD npx prisma db push && npx tsx src/main.ts