export MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace fy fy-db-mysql -o jsonpath="{.data.mysql-root-password}" | base64 --decode)
export DATABASE_URL="mysql://root:$MYSQL_ROOT_PASSWORD@localhost:3307/fy-site"
blitz prisma studio